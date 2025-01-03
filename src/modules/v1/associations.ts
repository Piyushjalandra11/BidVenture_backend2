import Product from './products/model';
import Auction from './auction/model';
import Category from './catagories/model';

export default function associateModels() {
  // Category-Auction association
  Auction.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  Category.hasMany(Auction, {
    foreignKey: "categoryId",
    as: "auctions",
  });

  // Many-to-many relationship between Auction and Product
  Auction.belongsToMany(Product, {
    through: "AuctionProduct", // Junction table
    foreignKey: "auctionId",
    otherKey: "productId",
    as: "products"
  });

  Product.belongsToMany(Auction, {
    through: "AuctionProduct", // Junction table
    foreignKey: "productId",
    otherKey: "auctionId",
    as: "auctions",
  });
}
