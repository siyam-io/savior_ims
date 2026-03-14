import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinary';
import { Product } from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
  let uploadedPublicId: string | null = null;

  try {
    const { vendor } = req.body;
    const { role, vendors, _id: userId } = req.user;

    // Vendor validation for non‑super‑admin
    if (role.name !== 'super-admin') {
      if (!vendors.includes(vendor)) {
        throw new Error('Access Denied: Unauthorized vendor assignment.');
      }
    }

    const productData: any = {
      ...req.body,
      lastUpdatedBy: userId,
    };

    // Parse inventory if sent as string
    if (typeof productData.inventory === 'string') {
      productData.inventory = JSON.parse(productData.inventory);
    }

    // Upload image if present
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
      productData.image = imageUrl;
      // Extract public ID for potential cleanup
      uploadedPublicId = getPublicIdFromUrl(imageUrl);
    }

    const product = await ProductService.createProduct(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    // Clean up uploaded image if product creation failed
    if (uploadedPublicId) await deleteFromCloudinary(uploadedPublicId);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  let newUploadedPublicId: string | null = null;

  try {
    const productId = req.params.id;
    const { role, vendors, _id: userId } = req.user;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Vendor isolation check
    if (role.name !== 'super-admin') {
      if (!vendors.includes(existingProduct.vendor.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized update attempt on this vendor\'s product.',
        });
      }
    }

    const updateData: any = { ...req.body };

    // Parse inventory if needed
    if (typeof updateData.inventory === 'string') {
      updateData.inventory = JSON.parse(updateData.inventory);
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingProduct.image) {
        const oldPublicId = getPublicIdFromUrl(existingProduct.image);
        if (oldPublicId) await deleteFromCloudinary(oldPublicId);
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
      updateData.image = imageUrl;
      newUploadedPublicId = getPublicIdFromUrl(imageUrl);
    }

    updateData.lastUpdatedBy = userId;
    const updatedProduct = await ProductService.updateProduct(productId, updateData);

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error: any) {
    // Clean up newly uploaded image if update fails
    if (newUploadedPublicId) await deleteFromCloudinary(newUploadedPublicId);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query: any = { ...req.query };
    const { role, vendors } = req.user;

    if (role.name !== 'super-admin') {
      query.vendorId = { $in: vendors };
    }

    const result = await ProductService.getProducts(query);

    res.status(200).json({
      success: true,
      data: result.products,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role.name !== 'super-admin') {
      if (!req.user.vendors.includes(product.vendor.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this product\'s data.',
        });
      }
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const { role, vendors } = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Vendor check
    if (role.name !== 'super-admin') {
      if (!vendors.includes(product.vendor.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Denied: Cannot delete product from unauthorized vendor.',
        });
      }
    }

    // Delete image from Cloudinary
    if (product.image) {
      const publicId = getPublicIdFromUrl(product.image);
      if (publicId) await deleteFromCloudinary(publicId);
    }

    await ProductService.deleteProduct(productId);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};