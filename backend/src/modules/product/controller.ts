import type { Request, Response } from 'express';
import Product from './model.js';
import Category from '../category/model.js';
import type { ProductInput } from './schema.js';

export const createProduct = async (req: Request<{}, {}, ProductInput>, res: Response): Promise<void> => {
  try {
    const { name, price, description, categoryId, subcategory, activatedSizes, visuals, stock } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(400).json({ error: 'Category not found' });
      return;
    }
    if (!category.subcategories.includes(subcategory)) {
      res.status(400).json({ error: 'Invalid subcategory' });
      return;
    }
    for (const size of activatedSizes) {
      if (!category.sizes.includes(size)) {
        res.status(400).json({ error: `Size ${size} not in category sizes` });
        return;
      }
    }
    const product = new Product({ name, price, description, categoryId, subcategory, activatedSizes, visuals, stock });
    await product.save();
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, subcategory, size } = req.query;
    let filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (subcategory) filter.subcategory = subcategory;
    if (size) filter.activatedSizes = size;
    
    const products = await Product.find(filter).populate('categoryId').lean();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId').lean();
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request<{ id: string }, {}, Partial<ProductInput>>, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFilteredProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      subcategory,
      size,
      minPrice,
      maxPrice,
      sort = '-createdAt'
    } = req.query;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }
    if (categoryId && categoryId !== 'all') filter.categoryId = categoryId;
    if (subcategory && subcategory !== 'all') filter.subcategory = subcategory;
    if (size && size !== 'all') filter.activatedSizes = size;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: skip + products.length < total
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

