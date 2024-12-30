import { Auction } from "./model";
import { Op } from 'sequelize';

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
  });
};