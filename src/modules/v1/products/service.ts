import { addProductToAuction } from "../auction/service";
import Product from "./model";

export const getAllProducts = async () => {
  return await Product.findAll();
};

export const getProductById = async (id: number) => {
  return await Product.findByPk(id);
};

export const createProduct = async (data: any) => {
  const { name, price, description, images, categoryId, userId,  warranty,
    modelYear,
    condition,
    owner,
    accidental,
    replacedParts,
    startTime, endTime
  
  } = data

  const product = await Product.create({
    name,
    price,
    description,
    images,
    categoryId,
    userId,
    warranty,
    modelYear,
    condition,
    owner,
    accidental,
    replacedParts
  });
  console.log("this is my product",product);
  

  const auction = await addProductToAuction(product, new Date(startTime), new Date(endTime));
  await product.update({ auctionId: auction.id });
  // await product.addCategories(categories);
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

export const updateProductStatus = async(productId: any, purchasedBy: any) => {

return await Product.update({status: "sold", purchasedBy: purchasedBy}, {
  where: { id: productId },
});

}