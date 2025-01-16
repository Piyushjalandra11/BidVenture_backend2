import Product from './products/model';
import Auction from './auction/model';
import Category from './catagories/model';
import Bidding from './bid/model';
import User from './auth/model';
import AuctionRoom from './auction/auctionroommodel';

export default function associateModels() {
  Category.hasMany(Auction, { foreignKey: 'categoryId', as: 'auctions' });
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

  Auction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  Auction.hasOne(Product, {
    foreignKey: "auctionId",
    as: "product",
    onDelete: "CASCADE"
  });
  Product.belongsTo(Auction, { foreignKey: "auctionId", as: "auction" });

  User.hasMany(Bidding, {
    foreignKey: "userId",
    as: "biddings",
  });

  Bidding.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Product.hasMany(Bidding, {
    foreignKey: "productId",
    as: "biddings",
  });

  Bidding.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
  });
  Bidding.belongsTo(Auction, {
    foreignKey: "auctionId",
    as: "auction",
  });
  Auction.hasMany(Bidding, {
    foreignKey: "auctionId",
    // as: "auctions",
    as: "biddings",
  })

  User.hasMany(Product, {
    foreignKey: "userId",
    as: "products",
  });

  Product.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Product.belongsTo(User, {
    foreignKey: "purchasedBy",
    as: "buyer",
  });

  AuctionRoom.belongsTo(Auction, {
    foreignKey: 'auctionId', 
    as: 'auction', 
  });

  Auction.hasOne(AuctionRoom, {
    foreignKey: 'auctionId',
    as: 'room', 
  });
}
