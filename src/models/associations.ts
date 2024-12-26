import Product from "./productModel";
import Category from "./categoryModel";
import Auction from "./auctionModel";

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });