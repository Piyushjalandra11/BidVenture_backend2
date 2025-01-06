import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";
import Product from "../products/model";
import Category from "../catagories/model";

export default class Auction extends Model {
  id!: number;
  name!: string;
  startTime!: Date;
  endTime!: Date;
  categoryId!: number;
  public status!: 'active' | 'closed' | 'upcoming';

  // Added methods for handling products
  public addProducts!: (products: Product[]) => Promise<void>;
  public getProducts!: () => Promise<Product[]>;
  public setProducts!: (products: Product[]) => Promise<void>;
}

Auction.init(
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
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
    status: {
      type: DataTypes.ENUM('active', 'closed', 'upcoming'),
      defaultValue: 'upcoming',
    },
  },
  {
    sequelize,
    modelName: "Auction",
    tableName: "auctions",
    timestamps: true,
  }
);
