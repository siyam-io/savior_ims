import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Sale } from "../models/Sale";
import { Vendor } from "../models/Vendor";
import { Category } from "../models/Category";
import { InventoryLog } from "../models/InventoryLog";
import mongoose from "mongoose";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { role, vendors, _id: userId } = req.user;
    const { dateRange = 'month', vendorId, categoryId } = req.query;

    // Build filter based on user role
    const productFilter: any = {};
    const saleFilter: any = {};

    // Vendor isolation for non-super-admin
    if (role.name !== "super-admin") {
      productFilter.vendor = { $in: vendors };
      saleFilter.vendor = { $in: vendors };
    }

    // Apply additional filters
    if (vendorId && vendorId !== 'all') {
      productFilter.vendor = new mongoose.Types.ObjectId(vendorId as string);
      saleFilter.vendor = new mongoose.Types.ObjectId(vendorId as string);
    }

    if (categoryId && categoryId !== 'all') {
      productFilter.category = new mongoose.Types.ObjectId(categoryId as string);
    }

    // Date range for sales
    const dateFilter = getDateRange(dateRange as string);
    if (dateFilter) {
      saleFilter.createdAt = dateFilter;
    }

    // Parallel queries for performance
    const [
      totalProducts,
      totalStock,
      totalSales,
      totalVendors,
      lowStockCount,
      noStockCount,
      recentActivities
    ] = await Promise.all([
      // Total products
      Product.countDocuments(productFilter),

      // Total stock across all products
      Product.aggregate([
        { $match: productFilter },
        { $unwind: "$inventory" },
        { $group: { _id: null, total: { $sum: "$inventory.quantity" } } }
      ]),

      // Total sales amount
      Sale.aggregate([
        { $match: saleFilter },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),

      // Total active vendors
      Vendor.countDocuments({ status: 'active' }),

      // Low stock count (products with any size < 10)
      Product.countDocuments({
        ...productFilter,
        "inventory.quantity": { $lt: 10, $gt: 0 }
      }),

      // No stock count (products with all inventory = 0)
      Product.countDocuments({
        ...productFilter,
        $or: [
          { inventory: { $size: 0 } },
          { inventory: { $not: { $elemMatch: { quantity: { $gt: 0 } } } } }
        ]
      }),

      // Recent activities (last 5 inventory logs)
      InventoryLog.find(
        role.name === "super-admin" ? {} : { 
          product: { 
            $in: await Product.find({ vendor: { $in: vendors } }).distinct('_id')
          } 
        }
      )
      .populate('product', 'productName image')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalStock: totalStock[0]?.total || 0,
          totalSales: totalSales[0]?.total || 0,
          totalVendors,
          lowStockCount,
          noStockCount
        },
        recentActivities
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestSellingProducts = async (req: Request, res: Response) => {
  try {
    const { role, vendors } = req.user;
    const { limit = 10, vendorId, categoryId } = req.query;

    const productFilter: any = {};
    if (role.name !== "super-admin") {
      productFilter.vendor = { $in: vendors };
    }
    if (vendorId && vendorId !== 'all') {
      productFilter.vendor = new mongoose.Types.ObjectId(vendorId as string);
    }
    if (categoryId && categoryId !== 'all') {
      productFilter.category = new mongoose.Types.ObjectId(categoryId as string);
    }

    const bestSelling = await Sale.aggregate([
      { $match: { 
        ...(role.name !== "super-admin" && { vendor: { $in: vendors } }),
        ...(vendorId && vendorId !== 'all' && { vendor: new mongoose.Types.ObjectId(vendorId as string) })
      } },
      { $group: {
        _id: "$product",
        totalSold: { $sum: "$quantity" },
        totalRevenue: { $sum: "$totalAmount" },
        saleCount: { $sum: 1 }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: Number(limit) },
      { $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }},
      { $unwind: "$product" },
      { $match: productFilter },
      { $lookup: {
        from: "vendors",
        localField: "product.vendor",
        foreignField: "_id",
        as: "product.vendor"
      }},
      { $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "product.category"
      }},
      { $unwind: { path: "$product.vendor", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$product.category", preserveNullAndEmptyArrays: true } }
    ]);

    res.status(200).json({
      success: true,
      data: bestSelling
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorstSellingProducts = async (req: Request, res: Response) => {
  try {
    const { role, vendors } = req.user;
    const { limit = 10, vendorId, categoryId } = req.query;

    const productFilter: any = { "inventory.quantity": { $gt: 0 } };
    if (role.name !== "super-admin") {
      productFilter.vendor = { $in: vendors };
    }
    if (vendorId && vendorId !== 'all') {
      productFilter.vendor = new mongoose.Types.ObjectId(vendorId as string);
    }
    if (categoryId && categoryId !== 'all') {
      productFilter.category = new mongoose.Types.ObjectId(categoryId as string);
    }

    const worstSelling = await Product.aggregate([
      { $match: productFilter },
      { $lookup: {
        from: "sales",
        localField: "_id",
        foreignField: "product",
        as: "sales"
      }},
      { $addFields: {
        totalSold: { $sum: "$sales.quantity" },
        saleCount: { $size: "$sales" }
      }},
      { $sort: { totalSold: 1, saleCount: 1 } },
      { $limit: Number(limit) },
      { $lookup: {
        from: "vendors",
        localField: "vendor",
        foreignField: "_id",
        as: "vendor"
      }},
      { $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }},
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }
    ]);

    res.status(200).json({
      success: true,
      data: worstSelling
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStockAnalysis = async (req: Request, res: Response) => {
  try {
    const { role, vendors } = req.user;
    const { type, vendorId, categoryId } = req.query;

    const productFilter: any = {};
    if (role.name !== "super-admin") {
      productFilter.vendor = { $in: vendors };
    }
    if (vendorId && vendorId !== 'all') {
      productFilter.vendor = new mongoose.Types.ObjectId(vendorId as string);
    }
    if (categoryId && categoryId !== 'all') {
      productFilter.category = new mongoose.Types.ObjectId(categoryId as string);
    }

    let products = [];

    switch (type) {
      case 'best-stock':
        products = await Product.aggregate([
          { $match: productFilter },
          { $addFields: {
            totalStock: { $sum: "$inventory.quantity" }
          }},
          { $sort: { totalStock: -1 } },
          { $limit: 10 },
          { $lookup: {
            from: "vendors",
            localField: "vendor",
            foreignField: "_id",
            as: "vendor"
          }},
          { $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }},
          { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }
        ]);
        break;

      case 'low-stock':
        products = await Product.find({
          ...productFilter,
          "inventory.quantity": { $lt: 10, $gt: 0 }
        })
        .populate('vendor', 'name')
        .populate('category', 'name')
        .populate('inventory.size', 'label')
        .sort({ "inventory.quantity": 1 })
        .limit(10);
        break;

      case 'no-stock':
        products = await Product.find({
          ...productFilter,
          $or: [
            { inventory: { $size: 0 } },
            { inventory: { $not: { $elemMatch: { quantity: { $gt: 0 } } } } }
          ]
        })
        .populate('vendor', 'name')
        .populate('category', 'name')
        .limit(10);
        break;

      default:
        products = await Product.find(productFilter)
          .populate('vendor', 'name')
          .populate('category', 'name')
          .populate('inventory.size', 'label')
          .limit(10);
    }

    res.status(200).json({
      success: true,
      data: products
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesTrend = async (req: Request, res: Response) => {
  try {
    const { role, vendors } = req.user;
    const { period = 'week' } = req.query;

    const matchFilter: any = {};
    if (role.name !== "super-admin") {
      matchFilter.vendor = { $in: vendors };
    }

    let groupFormat;
    let dateRange;

    switch (period) {
      case 'week':
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateRange = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateRange = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'year':
        groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        dateRange = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
        break;
      default:
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateRange = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    }

    matchFilter.createdAt = dateRange;

    const trend = await Sale.aggregate([
      { $match: matchFilter },
      { $group: {
        _id: groupFormat,
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: trend
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryDistribution = async (req: Request, res: Response) => {
  try {
    const { role, vendors } = req.user;

    const productFilter: any = {};
    if (role.name !== "super-admin") {
      productFilter.vendor = { $in: vendors };
    }

    const distribution = await Product.aggregate([
      { $match: productFilter },
      { $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalStock: { $sum: { $sum: "$inventory.quantity" } }
      }},
      { $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category"
      }},
      { $unwind: "$category" },
      { $project: {
        name: "$category.name",
        count: 1,
        totalStock: 1
      }},
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: distribution
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get date range
const getDateRange = (range: string) => {
  const now = new Date();
  switch (range) {
    case 'today':
      return { $gte: new Date(now.setHours(0, 0, 0, 0)) };
    case 'week':
      return { $gte: new Date(now.setDate(now.getDate() - 7)) };
    case 'month':
      return { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    case 'quarter':
      return { $gte: new Date(now.setMonth(now.getMonth() - 3)) };
    case 'year':
      return { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
    default:
      return null;
  }
};
