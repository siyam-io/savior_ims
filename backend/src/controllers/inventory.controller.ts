import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { Product } from "../models/Product";
import { InventoryLog } from "../models/InventoryLog";

export const handleGetInventory = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { role, vendors } = req.user;

    // Check vendor access
    if (role.name !== "super-admin" && !vendors.includes(vendorId)) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized: You do not have access to this vendor's inventory." 
      });
    }

    const products = await Product.find({ vendor: vendorId })
      .select("productName inventory image category price")
      .populate("category", "name")
      .populate("inventory.size", "label");

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleUpdateInventory = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { sizeId, quantity, type } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Vendor isolation check
    if (req.user.role.name !== "super-admin" && 
        !req.user.vendors.includes(product.vendor.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: "Denied: Unauthorized vendor access." 
      });
    }

    const adjustedQuantity = type === 'out' ? -Math.abs(quantity) : Math.abs(quantity);
    
    const updatedProduct = await ProductService.updateInventory(
      productId, 
      sizeId, 
      adjustedQuantity, 
      userId
    );

    res.status(200).json({
      success: true,
      message: `Stock ${type === 'out' ? 'deducted' : 'added'} successfully`,
      data: updatedProduct
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleGetInventoryLogs = async (req: Request, res: Response) => {
  try {
    const { productId, sizeId, page = 1, limit = 10 } = req.query;
    const { role, vendors, _id: userId } = req.user;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const filter: any = {};
    if (productId) filter.product = productId;
    if (sizeId) filter.size = sizeId;
    
    // If not super-admin, only show logs for their vendors
    if (role.name !== 'super-admin') {
      const products = await Product.find({ vendor: { $in: vendors } }).select('_id');
      const productIds = products.map(p => p._id);
      filter.product = { $in: productIds };
    }
    
    const total = await InventoryLog.countDocuments(filter);
    const logs = await InventoryLog.find(filter)
      .populate('product', 'productName image')
      .populate('size', 'label')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    res.status(200).json({ 
      success: true, 
      data: logs,
      meta: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};