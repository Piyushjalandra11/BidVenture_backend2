import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";  
import Product from "../products/model"; 
import User from "../auth/model";

export default class Bidding extends Model {
  id!: number;
  amount!: number;  
  createdAt!: Date;  
  userId!: number;  
  productId!: number;  

  public getUser!: () => Promise<User>;  
  public getProduct!: () => Promise<Product>;  
}

Bidding.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",  
    },
  },
  {
    sequelize,
    modelName: "Bidding",
    tableName: "biddings",
    timestamps: true,  
  }
);
