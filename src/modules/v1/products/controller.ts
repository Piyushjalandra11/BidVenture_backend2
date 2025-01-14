import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./service";
import Product from "./model";
import User from "../auth/model";
import { Op } from "sequelize";

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
    console.log(product, "product dat from backend");
    
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = JSON.parse(req.body.product_data);
    const files = req.files as Express.Multer.File[] | undefined;
console.log("product data from frontend",productData)
    if (!files || files.length === 0) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    const productPayload = {
      ...productData,
      images: files.map((file) => file.path),
      userId: req.user?.id,
      warranty: productData.warranty || "Not specified", 
      status: productData.status || "unsold", 
      modelYear: productData.modelYear || "Not specified", 
      condition: productData.condition || "Not specified", 
      owner: productData.ownerNumber || "Not specified", 
      accidental: productData.accidental || false, 
      replacedParts: productData.replacedParts || false, 
      startAuctionTime: productData.startAuctionTime,
      endAuctionTime: productData.endAuctionTime
    };

    const product = await createProduct(productPayload);
    console.log("product after backend created",product)

    res.status(201).json({
      message: "Product and Auction created successfully",
      product,
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



export const getUserProductHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }


    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { purchasedBy: userId }, 
          { userId: userId },      
        ],
      },
      
    });

    res.status(200).json({
      products
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};