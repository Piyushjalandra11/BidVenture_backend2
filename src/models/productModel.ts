import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public category!: string;
  public description!: string;
  public images!: string[]
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    images: { 
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
