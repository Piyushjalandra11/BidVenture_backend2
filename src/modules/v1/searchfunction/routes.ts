import express from "express";
import { searchProducts } from "./controller";

const router = express.Router();

router.get("/searchproducts", searchProducts);

export default router;
