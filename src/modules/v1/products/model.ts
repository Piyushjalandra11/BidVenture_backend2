import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../db";
import Category from "../catagories/model"

interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  public id!: number;
  public name!: string;
  public price!: number;
  public description!: string;
  public images!: string[];

  public addCategories!: (categories: Category[] | Category) => Promise<void>;
  public getCategories!: () => Promise<Category[]>;
  public setCategories!: (categories: Category[] | Category) => Promise<void>;
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
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

// Product.belongsToMany(Category, { through: "ProductCategories" });
// Category.belongsToMany(Product, { through: "ProductCategories" });

export default Product;
