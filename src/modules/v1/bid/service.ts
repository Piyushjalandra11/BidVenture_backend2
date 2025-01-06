import User from "../auth/model";
import Product from "../products/model";
import { updateProductStatus } from "../products/service";
import Bidding from "./model";

export const createSocketBid = async (data: any) => {
    try {
        const { amount, userId, productId, isSold } = data;

        const product: any = await Product.findByPk(productId);
        if (!product) {
            throw new Error("product not found")
        }

        if(product.isSold){
            throw new Error("product is already sold")
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found")
        }

        const bid = await Bidding.create({ amount, userId, productId });
        
        if(isSold){
            updateProductStatus(productId)
        }

        return bid

    } catch (error) {
        console.error("Error creating bid:", error);
    }
}