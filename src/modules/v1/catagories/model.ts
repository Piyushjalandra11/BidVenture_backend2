import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../../../db";

export default class Category extends Model {
  id!: number;
  name!: string;
  image!: string;
}


  Category.init(
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
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: false,
    }
  );
