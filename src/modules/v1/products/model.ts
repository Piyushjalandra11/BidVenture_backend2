import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";
import Category from "../catagories/model";
import Auction from "../auction/model";

// Product Model
export default class Product extends Model {
  id!: number;
  name!: string;
  price!: number;
  description!: string;
  images!: string[];
  categoryId!: number;

  // Method to associate with Auction
  static associate() {
    // Many-to-many relationship between Product and Auction
    this.belongsToMany(Auction, {
      through: "AuctionProduct", // Junction table
      foreignKey: "productId", // Foreign key for productId in the junction table
      otherKey: "auctionId", // Foreign key for auctionId in the junction table
      as: "auctions", // Alias for the associated auctions
    });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);
