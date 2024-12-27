import Product from "./model";

export const getAllProducts = async () => {
  return await Product.findAll();
};

export const getProductById = async (id: number) => {
  return await Product.findByPk(id);
};

export const createProduct = async (data: any) => {
  const { name, price, description, images, categories } = data

  const product = await Product.create({
    name,
    price,
    description,
    images,
  });

  
  await product.addCategories(categories);
  return product
};

export const updateProduct = async (id: number, data: any) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");
  return await product.update(data);
};

export const deleteProduct = async (id: number) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");
  return await product.destroy();
};
