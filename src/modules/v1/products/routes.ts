import { Router } from "express";
import { createProductHandler, deleteProductHandler, getProduct, getProducts, updateProductHandler } from "./controller";
import { upload } from "../../../middlewares/multer";

const router = Router();


router.get("/", getProducts);
router.get("/:id", getProduct);
router.post('/', upload.array('files', 10), createProductHandler);
router.put("/:id", updateProductHandler);
router.delete("/:id", deleteProductHandler);

export default router;  
