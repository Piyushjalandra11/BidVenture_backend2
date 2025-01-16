import { Request, Response } from "express";
import { Op } from "sequelize";
import Product from "../products/model";
import Category from "../catagories/model";
import { ProductSearchFilters } from "../../../@types";
import { WhereOptions } from "sequelize";

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { productName } = req.query;

    const filters: ProductSearchFilters = {};

    if (productName) {
      filters[Op.or] = [
        { name: { [Op.iLike]: `%${productName as string}%` } },
        { description: { [Op.iLike]: `%${productName as string}%` } },
      ];
    }

    const whereOptions: WhereOptions = filters as WhereOptions;

    const products = await Product.findAll({
      where: whereOptions,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({ success: true, data: products });
  } catch (error: unknown) {

    const errorMessage = (error as Error).message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};