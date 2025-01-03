import { Request, Response } from 'express';
import {
  getLiveAuctions,
  getUpcomingAuctions,
  getPreviousAuctions,
  getAuctionById,
  getAllAuctions,
  createAuction,
} from './service';
import { createProduct } from '../products/service';


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
};;



export const getUpcomingAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const upcomingAuctions = await getUpcomingAuctions(category as string);
    res.status(200).json(upcomingAuctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getPreviousAuctionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const previousAuctions = await getPreviousAuctions(category as string);
    res.status(200).json(previousAuctions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// export const createAuctionWithProduct = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const productData = JSON.parse(req.body.product_data);
//     const files = req.files as Express.Multer.File[] | undefined;

//     if (!files || files.length === 0) {
//       res.status(400).json({ message: "No files uploaded" });
//       return;
//     }
//     console.log("-files", files)


//     const productPayload = {
//       name: productData.name,
//       price: productData.price,
//       description: productData.description,
//       categories: productData.catagories,
//       images: files.map((file) => file.path),
//     };

//     const product = await createProduct(productPayload);
//     const auction = await createAuction({
//       productId: product.id,
//       start_time: productData.start_time,
//       end_time: productData.end_time
//     })
//     res.status(201).json({
//       message: "Product and Auction created successfully",
//       auction,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }


