import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { deleteFromCloudinary } from "../utils/cloudinary";
import { Product } from "../models/Product";

/**
 * @desc    Create a new product with vendor validation
 * @route   POST /api/products
 */
export const createProduct = async (req: Request, res: Response) => {
  let uploadedPublicId: string | null = null;
  
  try {
    // সার্ভিস অনুযায়ী ফিল্ড নেম 'vendor' হবে
    const { vendor } = req.body; 
    const { role, vendors, _id: userId } = req.user;

    if (role.name !== "super-admin") {
      if (!vendors.includes(vendor)) {
        throw new Error("Access Denied: Unauthorized vendor assignment.");
      }
    }

    const productData = { 
      ...req.body,
      lastUpdatedBy: userId 
    };

    if (req.file) {
      productData.image = req.file.path;
      uploadedPublicId = (req.file as any).filename;
    }

    const product = await ProductService.createProduct(productData);
    res.status(201).json({ success: true, data: product });

  } catch (error: any) {
    if (uploadedPublicId) await deleteFromCloudinary(uploadedPublicId);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update existing product with ownership check
 * @route   PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response) => {
  let newUploadedPublicId: string | null = null;
  
  try {
    const productId = req.params.id;
    const { role, vendors, _id: userId } = req.user;

    // ১. প্রোডাক্টটি আগে খুঁজে বের করো ওনারশিপ চেক করতে
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ২. ভেন্ডর আইসোলেশন চেক (Super Admin বাদে)
    if (role.name !== "super-admin") {
      if (!vendors.includes(existingProduct.vendorId.toString())) {
        return res.status(403).json({ success: false, message: "Unauthorized update attempt on this vendor's product." });
      }
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
      newUploadedPublicId = (req.file as any).filename;
      
      // পুরাতন ইমেজ ডিলিট করার লজিক (Service এ হ্যান্ডেল করা ভালো, অথবা এখানে)
    }

    updateData.lastUpdatedBy = userId;
    const updatedProduct = await ProductService.updateProduct(productId, updateData);
    
    res.status(200).json({ success: true, data: updatedProduct });

  } catch (error: any) {
    if (newUploadedPublicId) await deleteFromCloudinary(newUploadedPublicId);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all products (Isolated by Vendor array)
 * @route   GET /api/products
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const query: any = { ...req.query };
    const { role, vendors } = req.user;

    // 🔥 Super Admin না হলে শুধুমাত্র ইউজারের অ্যাসাইন করা ভেন্ডরদের প্রোডাক্ট দেখাও
    if (role.name !== "super-admin") {
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
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single product details
 * @route   GET /api/products/:id
 */
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ভেন্ডর এক্সেস চেক
    if (req.user.role.name !== "super-admin") {
      if (!req.user.vendors.includes(product.vendorId.toString())) {
        return res.status(403).json({ success: false, message: "Access denied to this product's data." });
      }
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete product with authorization
 * @route   DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const { role, vendors } = req.user;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // ভেন্ডর চেক
    if (role.name !== "super-admin") {
      if (!vendors.includes(product.vendorId.toString())) {
        return res.status(403).json({ success: false, message: "Denied: Cannot delete product from unauthorized vendor." });
      }
    }

    await ProductService.deleteProduct(productId);
    res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};