import { Request, Response } from "express";
import Category from "./model";

export const createCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      res.status(409).json({ message: "Category already exists" });
      return;
    }

    const category = await Category.create({ name });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating category",
      error,
    });
  }
};


export const getAllCategoriesHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error,
    });
  }
};


export const getCategoryByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category",
      error,
    });
  }
};


export const deleteCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error,
    });
  }
};
