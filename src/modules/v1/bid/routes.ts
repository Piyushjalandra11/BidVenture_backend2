import express from "express";
import { createBids } from "./controller"
import { getBids } from "./controller";

const router = express.Router();

router.post("/", createBids);
router.get('/bids', getBids);

export default router;
