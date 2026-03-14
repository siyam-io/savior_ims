import mongoose from "mongoose";
import { Sale } from "../models/Sale";
import { Product } from "../models/Product";
import { InventoryLog } from "../models/InventoryLog";

export const createSaleTransaction = async (saleData: any, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = new Sale({ ...saleData, soldBy: userId });

    for (const item of sale.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new Error(`Product not found: ${item.product}`);

      const sizeItem = product.inventory.find(i => i.size.toString() === item.size.toString());
      if (!sizeItem || sizeItem.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.productName}`);
      }

      const previousStock = sizeItem.quantity;
      sizeItem.quantity -= item.quantity; // স্টক কমানো

      // ইনভেন্টরি লগ তৈরি
      await InventoryLog.create([{
        product: item.product,
        size: item.size,
        user: userId,
        type: 'out',
        quantity: item.quantity,
        previousStock,
        newStock: sizeItem.quantity,
        note: `Sale generated. Invoice: ${sale._id}`
      }], { session });

      await product.save({ session });
    }

    await sale.save({ session });
    await session.commitTransaction();
    return sale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getSalesHistory = async (filters: any) => {
  return await Sale.find(filters)
    .populate("soldBy", "name")
    .populate("vendor", "name")
    .populate("items.product", "productName")
    .populate("items.size", "label")
    .sort({ createdAt: -1 });
};