import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./service";

import { SavedFile, saveFiles } from "../../../helpers/savedfiles";


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


//   try {
//     // Assuming req.files contains the images array
//     const images = req.files as Express.Multer.File[];  // Type assertion for multer files
//     const imagePaths = images.map((file) => `/uploads/${file.filename}`); // Save image paths

//     // Include image paths in the product data
//     const productData = {
//       ...req.body,  // Other product details
//       images: imagePaths, // Add image paths to the product data
//     };

//     const product = await createProduct(productData);
//     res.status(201).json(product);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export async function createProductHandler(req: Request, res: Response) {
  try {
    const { name, price, category, description } = req.body;

    // Use the helper to save files
    const savedFiles: SavedFile | SavedFile[] | null = saveFiles(req);

    const productData = {
      name,
      price,
      category,
      description,
      files: savedFiles, 
    };

    // Save productData to DB 
    const product = await createProduct(productData); 
    res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
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