import type { Request, Response } from 'express';
import Category from './model.js';
import type { CategoryInput } from './schema.js';

export const createCategory = async (req: Request<{}, {}, CategoryInput>, res: Response): Promise<void> => {
  try {
    const { name, subcategories, sizes } = req.body;
    const category = new Category({ name, subcategories, sizes });
    await category.save();
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req: Request<{ id: string }, {}, Partial<CategoryInput>>, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
