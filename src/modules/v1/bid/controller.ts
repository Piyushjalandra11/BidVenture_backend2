// import { Bid } from "./model";
import User from "../auth/model";
import { Request, Response } from 'express';
import Auction from "../auction/model"

export const createBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, userId, auctionId, productId } = req.body;

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      res.status(404).json({ message: 'Auction not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    const product = await User.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    }

    const bid = {}

    res.status(201).json({
      message: 'Bid created successfully',
      bid,
    });

  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};


export const getBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const bids: any = []

    if (bids.length === 0) {
      res.status(404).json({ message: 'No bids found' });
    }

    res.status(200).json({
      message: 'Bids fetched successfully',
      bids,
    });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Failed to fetch bids', error });
  }
};