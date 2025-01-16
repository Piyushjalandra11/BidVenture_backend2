import Auction from "../auction/model";
import User from "../auth/model";
import Product from "../products/model";
import { updateProductStatus } from "../products/service";
import Bidding from "./model";

export const createSocketBid = async (data: any) => {
    try {
        const { amount, userId, productId, isSold, auctionId } = data;
        console.log(data,"data in bidserveces")

        const product: any = await Product.findByPk(productId);
        if (!product) {
            throw new Error("product not found")
        }

        if(product.isSold){
            throw new Error("product is already sold")
        }

        const user:any = await User.findByPk(userId);
        console.log(" get useer details forund or not",user)
        if (!user) {
            throw new Error("User not found")
        }

        const auction = await Auction.findByPk(auctionId);
        if (!auction) {
            throw new Error("Auction not found")
        }

        const bid = await Bidding.create({ amount, userId, productId, auctionId });
        
        if(isSold){
            updateProductStatus(productId, userId)
        }

        // return bid
        return {
            ...bid.toJSON(),
            user: { name: user.name }, 
          };

    } catch (error) {
        console.error("Error creating bid:", error);
    }
}