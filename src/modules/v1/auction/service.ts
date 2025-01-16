import User from "../auth/model";
import Bidding from "../bid/model";
import Category from "../catagories/model";
import Product from "../products/model";
import Auction from "./model";
import { Op, Sequelize } from 'sequelize';

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
        attributes: [],
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
    group: ['Auction.id', 'category.id'],
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
