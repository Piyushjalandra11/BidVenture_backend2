import Auction from "../../../models/auctionModel";

export const createAuction = async (data: any) => {
  return await Auction.create(data);
};

export const getAuctionById = async (id: number) => {
    return await Auction.findByPk(id);
  };

  export const getAllAuctions = async () => {
    return await Auction.findAll();
  };