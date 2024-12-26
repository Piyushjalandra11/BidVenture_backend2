import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Category from "./categoryModel";
import Auction from "./auctionModel";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public categoryId!: number;
  public auctionId!: number | null;
  public description!: string;
  public images!: string[];
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
        model: "categories", // Table name for the Category model
        key: "id",
      },
    },
    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "auctions", // Table name for the Auction model
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
