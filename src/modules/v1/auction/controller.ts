import { Request, Response } from 'express';
import {
  getLiveAuctions,
  getUpcomingAuctions,
  getPreviousAuctions,
  getAuctionById,
  getAllAuctions,
  createAuction,
  getAuctionDetailsById
} from './service';
import Bidding from '../bid/model';
import User from '../auth/model';
import Auction from './model';
import Product from '../products/model';

export const getAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctions = await getAllAuctions();
    res.status(200).json(auctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuctionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctionId = parseInt(req.params.id); // Convert string to number

    if (isNaN(auctionId)) {
      res.status(400).json({ message: 'Invalid auction ID' });
      return;
    }

    const auction = await getAuctionById(auctionId);

    if (!auction) {
      res.status(404).json({ message: 'Auction not found' });
      return;
    }

    res.status(200).json(auction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAuctionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctionData = req.body;
    const auction = await createAuction(auctionData);
    res.status(201).json({
      message: 'Auction created successfully',
      auction: auction,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLiveAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const liveAuctions = await getLiveAuctions();
    res.status(200).json(liveAuctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const upcomingAuctions = await getUpcomingAuctions();
    res.status(200).json(upcomingAuctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getPreviousAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const previousAuctions = await getPreviousAuctions();
    res.status(200).json(previousAuctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const joinAuctionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctionId = parseInt(req.params.id);
    if (isNaN(auctionId)) {
      res.status(400).json({ message: 'Invalid auction ID' });
      return;
    }

    // Fetch the auction details and its products
    const auction = await Auction.findOne({
      where: { id: auctionId, status: 'active' },
      include: [
        {
          model: Product,
          as: 'products',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    if (!auction) {
      res.status(404).json({ message: 'Auction not found or is not active' });
      return;
    }

    // Calculate remaining time
    const currentTime = new Date();
    const remainingTime = auction.endTime.getTime() - currentTime.getTime();
    if (remainingTime <= 0) {
      res.status(400).json({ message: 'Auction has already ended' });
      return;
    }

    // Fetch the highest bid for the auction's product
    const highestBid = await Bidding.findOne({
      where: { auctionId },
      order: [['amount', 'DESC']],
    });
    const currentBid = highestBid ? highestBid.amount : 0;

    // Get leaderboard
    const leaderboard = await Bidding.findAll({
      where: { auctionId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['amount', 'DESC']],
    });

    res.status(200).json({
      auctionId,
      remainingTime,
      currentBid,
      leaderboard,
    });
  } catch (error) {
    console.error('Error joining auction:', error);
    res.status(500).json({ message: 'Failed to join auction', error });
  }
};


export const getAuctionsDetailsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctionId = parseInt(req.params.id)

    if (isNaN(auctionId)) {
      res.status(400).json({ messege: "Invalid auction id" })
      return;
    }

    const auctionData = await getAuctionDetailsById(auctionId)

    if (!auctionData) {
      res.status(400).json({ messege: "Auction not found" })
      return;
    }

    res.status(200).json({
      success: true,
      data: auctionData
    })

  }
  catch (error: any) {
    res.status(500).json({ message: error.mesaage })
  }
}
