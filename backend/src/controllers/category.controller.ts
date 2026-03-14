import { Request, Response } from "express";
import * as CategoryService from "../services/category.service";

/**
 * @desc    Create a new Category
 * @route   POST /api/categories
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = {
      ...req.body,
      createdBy: req.user._id
    };

    const category = await CategoryService.createCategory(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all Categories (Vendor Isolated)
 * @route   GET /api/categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    let filters: any = {};
    if (req.user.role.name !== "super-admin") {
      filters.vendorId = { $in: req.user.vendors };
    }

    const categories = await CategoryService.getAllCategories(filters);
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Single Category
 * @route   GET /api/categories/:id
 */
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (req.user.role.name !== "super-admin" && category.vendorId && !req.user.vendors.includes(category.vendorId.toString())) {
      return res.status(403).json({ success: false, message: "Access denied to this vendor's category" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Category
 * @route   PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const existingCategory = await CategoryService.getCategoryById(req.params.id);
    if (!existingCategory) return res.status(404).json({ success: false, message: "Category not found" });

    if (req.user.role.name !== "super-admin" && existingCategory.vendorId && !req.user.vendors.includes(existingCategory.vendorId.toString())) {
      return res.status(403).json({ success: false, message: "Unauthorized update attempt" });
    }

    const category = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Category
 * @route   DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const existingCategory = await CategoryService.getCategoryById(req.params.id);
    if (!existingCategory) return res.status(404).json({ success: false, message: "Category not found" });

    if (req.user.role.name !== "super-admin" && existingCategory.vendorId && !req.user.vendors.includes(existingCategory.vendorId.toString())) {
      return res.status(403).json({ success: false, message: "Unauthorized delete attempt" });
    }

    await CategoryService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SUB-CATEGORY CONTROLLERS ---

/**
 * @desc    Create Sub-Category
 * @route   POST /api/categories/sub
 */
export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await CategoryService.createSubCategory(req.body);
    res.status(201).json({ success: true, data: subCategory });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all Sub-Categories (Filtered if needed)
 * @route   GET /api/categories/sub
 */
export const getSubCategories = async (req: Request, res: Response) => {
  try {
    let filters: any = {};
    if (req.user.role.name !== "super-admin") {
    }
    
    const subCategories = await CategoryService.getAllSubCategories(filters);
    res.status(200).json({ success: true, data: subCategories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Sub-Category
 * @route   DELETE /api/categories/sub/:id
 */
export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await CategoryService.deleteSubCategory(req.params.id);
    if (!subCategory) return res.status(404).json({ success: false, message: "Sub-Category not found" });
    res.status(200).json({ success: true, message: "Sub-Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};