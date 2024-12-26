import { Router } from "express";
import { createAuctionHandler, getAuctionHandler, getAuctionsHandler } from "./controller";
const auctionRouter = Router();

auctionRouter.get("/", getAuctionsHandler);
auctionRouter.get("/:id", getAuctionHandler);
auctionRouter.post("/", createAuctionHandler);

export default auctionRouter;
