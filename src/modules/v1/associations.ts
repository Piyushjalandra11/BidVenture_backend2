import Product from "./products/model";
import Category from "./catagories/model"
import ProductCategory from "./products/product_category_model"

// Many-to-Many Association
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "productId",
  as: "categories",
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "categoryId",
  as: "products",
});
