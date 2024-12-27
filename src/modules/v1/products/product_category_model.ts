import { DataTypes, Model } from "sequelize";
import sequelize from "../../../db";

class ProductCategory extends Model {
  public productId!: number;
  public categoryId!: number;
}

ProductCategory.init(
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "ProductCategory",
    tableName: "product_categories",
    timestamps: false,
  }
);

export default ProductCategory;
