import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./service";
import { createAuction } from "../auction/service";
import Category from "../../../models/categoryModel";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const productData = JSON.parse(req.body.product_data);
//     // console.log("-productData-", productData);


//     const files = req.files as Express.Multer.File[] | undefined;

//     if (!files || files.length === 0) {
//       res.status(400).json({ message: "No files uploaded" });
//       return;
//     }


//     const productPayload = {
//       ...productData,
//       image_urls: files.map((file) => file.path),
//     };


//     const product = await createProduct(productPayload);

//     res.status(201).json({
//       message: "Product created successfully",
//       product: product,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = JSON.parse(req.body.product_data);
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    // Check if the category exists
    const category = await Category.findByPk(productData.categoryId);
    if (!category) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }

    // Create Auction
    const auctionData = {
      productId: productData.id,
      startingBid: productData.startingBid,
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 10 * 1000), // 10 seconds auction
    };
    const auction = await createAuction(auctionData);

    const productPayload = {
      ...productData,
      image_urls: files.map((file) => file.path),
      auctionId: auction.id,
    };

    const product = await createProduct(productPayload);

    res.status(201).json({
      message: "Product and Auction created successfully",
      product,
      auction,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const images = req.files as Express.Multer.File[];
    const imagePaths = images.map((file) => `/uploads/${file.filename}`);

    const updatedProductData = {
      ...req.body,
      images: imagePaths,
    };

    const product = await updateProduct(productId, updatedProductData);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    await deleteProduct(Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
