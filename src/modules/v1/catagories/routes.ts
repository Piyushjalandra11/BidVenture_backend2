import express from "express";
import {
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  deleteCategoryHandler,
} from "./controller";

const router = express.Router();

router.post("/", createCategoryHandler); 
router.get("/", getAllCategoriesHandler); 
router.get("/:id", getCategoryByIdHandler); 
router.delete("/:id", deleteCategoryHandler); 

export default router;
