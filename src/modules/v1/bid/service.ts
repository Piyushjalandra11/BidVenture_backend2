import  Auction  from "../auction/model";
import User from "../auth/model";
import { Bid } from "./model";

export const createSocketBid = async (data: any) => {
    try {
        const { amount, userId, auctionId } = data;

        const auction = await Auction.findByPk(auctionId);
        if (!auction) {
            throw new Error("Auction not found")
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found")
        }

        const bid = await Bid.create({ amount, userId, auctionId });

        return bid

    } catch (error) {
        console.error("Error creating bid:", error);
    }
}