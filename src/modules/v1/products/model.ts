import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";
import Category from "../catagories/model";
import User from "../auth/model";

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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE", // If the user is deleted, products will be deleted as well
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);
