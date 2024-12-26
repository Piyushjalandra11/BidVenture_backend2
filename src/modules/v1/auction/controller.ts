import { Request, Response } from "express";
import { createAuction, getAuctionById, getAllAuctions } from "./service";

// Get all auctions
export const getAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctions = await getAllAuctions();
    res.status(200).json(auctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get auction by ID
export const getAuctionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auction = await getAuctionById(Number(req.params.id));
    if (!auction) {
      res.status(404).json({ message: "Auction not found" });
      return;
    }
    res.status(200).json(auction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create auction for a product
export const createAuctionHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const auctionData = req.body; // Assuming auction data is coming in request body
    const auction = await createAuction(auctionData);
    res.status(201).json({
      message: "Auction created successfully",
      auction: auction,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
