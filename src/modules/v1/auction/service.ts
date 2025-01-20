import User from "../auth/model";
import Bidding from "../bid/model";
import Category from "../catagories/model";
import Product from "../products/model";
import Auction from "./model";
import { Op, Sequelize } from 'sequelize';
import nodemailer from 'nodemailer'

export const createAuction = async (data: any) => {
  return await Auction.create(data);
};

export const getAuctionById = async (auctionId: number) => {
  return await Auction.findOne({
    where: { id: auctionId },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image'],
      },
      {
        model: Product,
        as: 'product'

      },
    ],
  });
};

export const getAllAuctions = async () => {
  return await Auction.findAll({
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', "image"],
      },
    ],
  });
};

export const getLiveAuctions = async () => {
  const currentTime = new Date();
  const whereCondition: any = {
    startTime: { [Op.lte]: currentTime },
    endTime: { [Op.gte]: currentTime },
    status: 'active',
  };

  return await Auction.findAll({
    where: whereCondition,
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
  });
};

export const getUpcomingAuctions = async (category?: string) => {
  const currentTime = new Date();
  const whereCondition: any = {
    startTime: { [Op.gte]: currentTime },
    status: 'upcoming',
  };

  return await Auction.findAll({
    where: whereCondition,
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
  });
};

export const getPreviousAuctions = async (category?: string) => {
  const currentTime = new Date();
  const whereCondition: any = {
    endTime: { [Op.lt]: currentTime },
    status: 'closed',
  };

  if (category) {
    whereCondition.category = category;
  }

  return await Auction.findAll({
    where: whereCondition,
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ["id", "name", "price", "description", "images"],
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image'],
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('product.id')),
          'productCount',
        ],
      ],
    },
    group: ['Auction.id', 'category.id', 'product.id'],
  });
};

export const addProductToAuction = async (product: any, startTime: Date, endTime: Date) => {
  try {
    const auction = await Auction.create({
      name: `Auction for ${product.name} - ${new Date().toISOString()}`,
      startTime: startTime,
      endTime: endTime,
      categoryId: product.categoryId,
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return auction;
  }
  catch (error) {
    console.error("Error adding product to auction:", error);
    throw error;
  }
};

export const getAuctionDetailsById = async (auctionId: number) => {
  try {
    const auction = await Auction.findOne({
      where: { id: auctionId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "description", "images"],
        },
        {
          model: Bidding,
          as: "biddings",
          attributes: ["id", "userId", "amount", "createdAt"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!auction) return null;
    return {
      auctionId: auction.id,
      product: auction.product,
      bids: auction.biddings?.map((bid: any) => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        user: bid.user,
      })),
    };
  } catch (error: any) {
    throw new Error("Unable to fetch auction details");
  }
};

const sendWinnerEmail = async (
  email: string,
  name: string,
  productName: string,
  productDescription: string,
  highestBid: number
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "piyush.jalandar@hiteshi.com", 
      pass: "obhl grtx qhda gdxl"
    },
  });

  const mailOptions = {
    from: '"Auction Platform" <your-email@gmail.com>',
    to: email,
    subject: `Congratulations! You won the auction for ${productName}`,
    text: `
Dear ${name},

Congratulations! You have won the auction for the product "${productName}".
Here are the details of your auction win:

Product Name: ${productName}
Description: ${productDescription}
Winning Bid Amount: ₹${highestBid}

Please proceed to complete the payment of ₹${highestBid} to claim your product.

Thank you for participating in our auction platform!

Best regards,
Auction Team
`,
    html: `
<p>Dear ${name},</p>
<p>Congratulations! You have won the auction for the product <strong>${productName}</strong>.</p>
<p><strong>Auction Details:</strong></p>
<ul>
  <li><strong>Product Name:</strong> ${productName}</li>
  <li><strong>Description:</strong> ${productDescription}</li>
  <li><strong>Winning Bid Amount:</strong> ₹${highestBid}</li>
</ul>
<p>Please proceed to complete the payment of <strong>₹${highestBid}</strong> to claim your product.</p>
<p>Thank you for participating in our auction platform!</p>
<p>Best regards,<br>Auction Team</p>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending winner email:", error);
    throw error;
  }
};

export const declareAuctionWinners = async () => {
  try {
    const closedAuctions = await Auction.findAll({
      where: { status: "closed", winnerId: null },
      include: [
        {
          model: Bidding,
          as: "biddings",
          attributes: ["id", "userId", "amount"],
          order: [["amount", "DESC"]],
          limit: 1,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: ["name", "description", "price"],
        },
      ],
    });

    for (const auction of closedAuctions) {
      const highestBid = auction.biddings?.[0];
      if (highestBid) {
        // Update auction with winner details
        auction.winnerId = highestBid.userId;
        await auction.save();

        // Send winner email with detailed information
        const winnerEmail = highestBid.user.email;
        const winnerName = highestBid.user.name;
        const productName = auction.product?.name || "your auctioned product";
        const productDescription = auction.product?.description || "No description available";
        const winningAmount = highestBid.amount;

        await sendWinnerEmail(winnerEmail, winnerName, productName, productDescription, winningAmount);
        console.log(`Winner email sent to ${winnerEmail}`);
      }
    }
  } catch (error) {
    console.error("Error declaring auction winners:", error);
    throw error;
  }
};
