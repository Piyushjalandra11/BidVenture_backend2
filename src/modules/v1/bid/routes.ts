import express from "express";
import { createBids, getLeaderBoard } from "./controller"
import { getBids } from "./controller";

const router = express.Router();

router.post("/", createBids);
router.get('/bids', getBids);

router.get('/leaderoard/product/:id', getLeaderBoard )

export default router;
