import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../db";
import Product from "../products/model";

interface CategoryAttributes {
  id: number;
  name: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
  public id!: number;
  public name!: string;

  public addProducts!: (products: Product[] | Product) => Promise<void>;
  public getProducts!: () => Promise<Product[]>;
  public setProducts!: (products: Product[] | Product) => Promise<void>;
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
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: true,
  }
);

export default Category;
