import { Router } from "express";
import { createProductHandler,  deleteProductHandler, getProduct, getProducts, updateProductHandler } from "./controller";
import { upload } from "../../../middlewares/multer";
import auth from "../../../middlewares/auth";
import { getUserProductHistory } from "./controller";

const router = Router();

router.get("/", getProducts);
router.post('/', auth, upload.array('files', 10), createProductHandler);


router.get("/history", auth, getUserProductHistory);
router.get("/:id", getProduct);
router.put("/:id", updateProductHandler);
router.delete("/:id", deleteProductHandler);



export default router;  
