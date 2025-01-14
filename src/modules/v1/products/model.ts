import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";
import Category from "../catagories/model";
import User from "../auth/model";
import Auction from "../auction/model";

export default class Product extends Model {
  id!: number;
  name!: string;
  price!: number;
  description!: string;
  images!: string[];
  categoryId!: number;
  public status!: 'active' | 'closed' | 'upcoming';

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
    // ...existing fields
    startAuctionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endAuctionTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('unsold', 'sold'),
      defaultValue: 'unsold',
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

    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Auction,
        key: "id",
      },
      onDelete: "SET NULL", // If the auction is deleted, set auctionId to null
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    warranty: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    modelYear: {
      type: DataTypes.STRING, 
      allowNull: true,

    },
    condition: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    accidental: {
      type: DataTypes.BOOLEAN, 
      defaultValue: false,
      allowNull: true,
    },
    replacedParts: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    purchasedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
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
