import express from "express";
import {
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  deleteCategoryHandler,
} from "./controller";
import { upload } from "../../../middlewares/multer";

const router = express.Router();

router.post("/", upload.single('file'),createCategoryHandler);
router.get("/", getAllCategoriesHandler);
router.get("/:id", getCategoryByIdHandler);
router.delete("/:id", deleteCategoryHandler);

export default router;
