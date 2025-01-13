// routes/productRoutes.ts
import express from "express";
import { searchProducts } from "./controller";

const router = express.Router();

// Define the route for searching products
router.get("/searchproducts", searchProducts);

export default router;
