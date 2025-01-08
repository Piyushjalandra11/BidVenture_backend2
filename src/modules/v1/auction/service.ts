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
        as: 'products',
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'image'],
          },
        ],
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
    status: 'active',
  };

  return await Auction.findAll({
    where: whereCondition,
    include: [
      {
        model: Category,
        as: 'category', 
        attributes: ['id', 'name', "image", ], 
      },
      {
        model: Product,
        as: 'products',
        attributes: [], 
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('products.id')),
          'productCount',
        ],
      ],
    },
    group: ['Auction.id', 'category.id'],
    
  });
};


export const getUpcomingAuctions = async (category?: string) => {
  const currentTime = new Date();
  const whereCondition: any = {
    startTime: { [Op.gte]: currentTime },
    status: 'upcoming',
  };

  if (category) {
    whereCondition.category = category;
  }

  return await Auction.findAll({
    where: whereCondition,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', "image"],
      },{
        model: Product,
        as: 'products',
        attributes: [], 
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('products.id')),
          'productCount',
        ],
      ],
    },
    group: ['Auction.id', 'category.id'],
    
    
  });
};


export const getPreviousAuctions = async (category?: string) => {
  const currentTime = new Date();
  const whereCondition: any = {
    // end_time: { [Op.lt]: currentTime },
    status: 'closed',
  };

  if (category) {
    whereCondition.category = category;
  }

  return await Auction.findAll({
    where: whereCondition,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'image'], 
      },
      {
        model: Product,
        as: 'products',
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('products.id')), 
          'productCount',
        ],
      ],
    },
    group: ['Auction.id', 'category.id'],
  });
};


export const addProductToAuction = async (product: any) => {
  try {
    let auction: any = await Auction.findOne({
      where: { status: 'upcoming', categoryId: product.categoryId },
      include: [
        {
          model: Product,
          as: 'products'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (auction && auction.products.length < 50) {
      console.log("Adding product to existing auction with less than 100 products.");
    } else {
      console.log("No eligible auction found. Creating a new auction...");
      auction = await Auction.create({
        name: `Auction - ${new Date().toISOString()}`,
        startTime: new Date(new Date().getTime() + 1 * 60 * 1000),
        categoryId: product.categoryId,
        status: 'upcoming'
      });
    }

    await product.update({ auctionId: auction.id });

    console.log("Product successfully added to auction!");

    return product;
  } catch (error) {
    console.error("Error adding product to auction:", error);
    throw error;
  }
};
