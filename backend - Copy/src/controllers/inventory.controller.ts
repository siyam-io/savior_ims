import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { Product } from "../models/Product";

export const handleGetInventory = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { role, vendors } = req.user;

    // ১. চেক করা হচ্ছে ইউজারের এই নির্দিষ্ট ভেন্ডরের এক্সেস আছে কিনা (সুপার এডমিন বাদে)
    if (role.name !== "super-admin" && !vendors.includes(vendorId)) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized: You do not have access to this vendor's inventory." 
      });
    }

    const products = await Product.find({ vendorId })
      .select("productName inventory totalStock image category")
      .populate("category", "name");

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const handleUpdateInventory = async (req: Request, res: Response) => {

//   try {
//     const { productId } = req.params;
//     const { sizeId, quantity, type } = req.body;
//     const userId = req.user._id;

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ success: false, message: "Product not found" });

//     // ২. ভেন্ডর আইসোলেশন চেক
//     if (req.user.role.name !== "super-admin" && !req.user.vendors.includes(product.vendorId.toString())) {
//       return res.status(403).json({ success: false, message: "Denied: Unauthorized vendor access." });
//     }

//     const adjustedQuantity = type === 'out' ? -Math.abs(quantity) : Math.abs(quantity);
    
//     // সার্ভিস কল করে ইনভেন্টরি আপডেট
//     const updatedProduct = await ProductService.updateInventory(productId, sizeId, adjustedQuantity, userId);

//     res.status(200).json({
//       success: true,
//       message: `Stock ${type === 'out' ? 'deducted' : 'added'} successfully`,
//       data: updatedProduct
//     });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };




// In inventory.controller.ts - your handleUpdateInventory function seems fine, but let's verify

export const handleUpdateInventory = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { sizeId, quantity, type } = req.body;
    const userId = req.user._id; // This is already being passed correctly

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Vendor isolation check
    if (req.user.role.name !== "super-admin" && !req.user.vendors.includes(product.vendorId.toString())) {
      return res.status(403).json({ success: false, message: "Denied: Unauthorized vendor access." });
    }

    const adjustedQuantity = type === 'out' ? -Math.abs(quantity) : Math.abs(quantity);
    
    // This now includes inventory log creation
    const updatedProduct = await ProductService.updateInventory(productId, sizeId, adjustedQuantity, userId);

    res.status(200).json({
      success: true,
      message: `Stock ${type === 'out' ? 'deducted' : 'added'} successfully`,
      data: updatedProduct
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};




// In inventory.controller.ts

export const handleGetInventoryLogs = async (req: Request, res: Response) => {
  try {
    const { productId, sizeId } = req.query;
    const userId = req.user._id;
    
    // You can add role-based filtering here
    const logs = await ProductService.getInventoryLogs(
      productId as string, 
      sizeId as string,
      req.user.role.name === 'super-admin' ? undefined : userId
    );
    
    res.status(200).json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};