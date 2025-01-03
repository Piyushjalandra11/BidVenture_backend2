import sequelize from "../../../db";
import Category from "../catagories/model";
import Product from "../products/model";
import Auction from "./model";
import { Op, Sequelize } from 'sequelize';

export const createAuction = async (data: any) => {
  return await Auction.create(data);
};

export const getAuctionById = async (auctionId: number) => {
  return await Auction.findByPk(auctionId);
};

export const getAllAuctions = async () => {
  return await Auction.findAll();
};

export const getLiveAuctions = async () => {
  const currentTime = new Date();
  const whereCondition: any = {
    start_time: { [Op.lte]: currentTime },          
    end_time: { [Op.gte]: currentTime }, 
    status: 'active',
  };

  return await Auction.findAll({
    where: whereCondition,
  });
};


export const getUpcomingAuctions = async (category?: string) => {
  const currentTime = new Date();
  const whereCondition: any = {
    start_time: { [Op.gte]: currentTime },
    status: 'upcoming',
  };

  if (category) {
    whereCondition.category = category;
  }

  return await Auction.findAll({
    where: whereCondition,
  });
};


export const getPreviousAuctions = async (category?: string) => {
  const currentTime = new Date();
  const whereCondition: any = {
    end_time: { [Op.lt]: currentTime },
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
        required: true,
        include: [
          {
            model: Category,
            as: 'categories',  
            required: false,  
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ]
      }
    ]
  });
};

export const findAuctionsWithProductCount = async (product: any) => {
  try {
    // Step 1: Find auctions with product count
    const auctions = await Auction.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('products.id')),
            'productCount', // Alias for the product count
          ],
        ],
      },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: [], // Exclude product attributes in the result
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'], // Include category details
        },
      ],
      group: ['Auction.id', 'category.id'], // Group by auction and category to avoid aggregation conflicts
    });
    console.log("auctions", auctions);

    // Step 2: Create a new auction and associate the product
    const newAuction = await Auction.create({
      name: `Auction for Product ${product.id}`, // You can customize the name
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 10 * 1000), // Auction ends in 10 seconds
      categoryId: product.categoryId,
      status: "upcoming"
    });

    // Associate the product with the new auction using `addProducts`
    await newAuction.addProducts([product.id]);

    console.log("New Auction Created", newAuction);

    return auctions; // Return auctions with product count
  } catch (error) {
    console.error("Error in findAuctionsWithProductCount:", error);
    throw new Error("Error finding auctions or creating a new auction.");
  }
};