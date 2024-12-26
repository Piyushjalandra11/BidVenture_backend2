import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Product from "./productModel";

class Auction extends Model {
  public id!: number;
  public productId!: number;
  public startingBid!: number;
  public startTime!: Date;
  public endTime!: Date;
}

Auction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product, // Reference to Product model
        key: 'id',
      },
      allowNull: false,
    },
    startingBid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Auction",
    tableName: "auctions",
    timestamps: true,
  }
);

export default Auction;
