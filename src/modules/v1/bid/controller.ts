import Bidding from "./model";
import User from "../auth/model";
import { Request, Response } from 'express';
import Auction from "../auction/model";
import Product from "../products/model";

// Create bid for an auction
export const createBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, userId, auctionId, productId } = req.body;

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      res.status(404).json({ message: 'Auction not found' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const product = await Product.findByPk(productId); // Ensure you're using the correct model (Product)
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Create a new bid entry
    const bid = await Bidding.create({
      amount,
      userId,
      auctionId,
      productId,
    });

    res.status(201).json({
      message: 'Bid created successfully',
      bid,
    });
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ message: 'Failed to create bid', error });
  }
};

// Fetch all bids for a product
export const getBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const bids = await Bidding.findAll({
      where: { productId: req.params.productId },
    });

    if (bids.length === 0) {
      res.status(404).json({ message: 'No bids found' });
      return;
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

// Fetch the leaderboard for a product
export const getLeaderBoard = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw new Error("Product ID not found");
    }

    const leaderboards = await Bidding.findAll({
      where: { productId: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      message: 'Leaderboards fetched successfully',
      leaderboards,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error });
  }
};
