import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";

class AuctionProduct extends Model {
  auctionId!: number;
  productId!: number;
}

AuctionProduct.init(
  {
    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "auctions",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "AuctionProduct",
    tableName: "AuctionProduct", // Junction table name
    timestamps: false,
  }
);

export default AuctionProduct;
