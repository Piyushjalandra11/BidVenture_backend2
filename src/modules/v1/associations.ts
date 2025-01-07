import Product from './products/model';
import Auction from './auction/model';
import Category from './catagories/model';
import Bidding from './bid/model';
import User from './auth/model';

export default function associateModels() {
  Category.hasMany(Auction, { foreignKey: 'categoryId', as: 'auctions' });
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

  Auction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Auction.hasMany(Product, { foreignKey: 'auctionId', as: 'products' });

  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Product.belongsTo(Auction, { foreignKey: 'auctionId', as: 'auction' })

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

}
