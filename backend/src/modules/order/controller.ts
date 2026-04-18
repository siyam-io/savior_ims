import type { Response } from 'express';
import mongoose from 'mongoose';
import { Parser } from 'json2csv';
import Order from './model.js';
import Product from '../product/model.js';
import { createBulkOrder } from '../../services/pathao.service.js';
import type { AuthRequest } from '../../types/index.js';
import type { PlaceOrderInput } from './schema.js';

export const placeOrder = async (req: AuthRequest<{}, {}, PlaceOrderInput>, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { 
      items, 
      outletId, 
      customerName, 
      customerPhone, 
      customerAddress, 
      orderNote, 
      riderNote, 
      discount = 0, 
      courierId,
      verificationCall = false
    } = req.body;
    const employeeId = req.user!.id;
    let subtotal = 0;

    for (const item of items) {
      const { productId, size, quantity, unitPrice } = item;
      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error(`Product ${productId} not found`);
      
      const stockEntry = product.stock.find(s => s.size === size);
      if (!stockEntry || stockEntry.quantity < quantity) {
        throw new Error(`Insufficient stock for ${product.name} size ${size}`);
      }

      const updateResult = await Product.updateOne(
        {
          _id: productId,
          'stock.size': size,
          'stock.quantity': { $gte: quantity },
        },
        { $inc: { 'stock.$.quantity': -quantity } },
        { session }
      );
      if (updateResult.modifiedCount === 0) {
        throw new Error(`Concurrent modification – stock changed for ${product.name} size ${size}`);
      }
      subtotal += quantity * unitPrice;
    }

    const totalAmount = subtotal - discount;

    const order = new Order({ 
      employeeId, 
      outletId, 
      items, 
      totalAmount,
      customerName,
      customerPhone,
      customerAddress,
      orderNote,
      riderNote,
      discount,
      courierId,
      verificationCall,
      createdBy: req.user!.id
    });
    await order.save({ session });
    await session.commitTransaction();
    res.status(201).json({ message: 'Order placed', order });
  } catch (err: any) {
    await session.abortTransaction();
    res.status(409).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

export const getEmployeeOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ employeeId: req.user!.id })
      .populate('items.productId')
      .populate('createdBy')
      .populate('updatedBy');
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('employeeId')
      .populate('items.productId')
      .populate('outletId')
      .populate('courierId')
      .populate('createdBy')
      .populate('updatedBy');
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalesAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const match: any = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate as string);
      if (endDate) match.createdAt.$lte = new Date(endDate as string);
    }
    const analytics = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$employeeId',
          totalUnits: { $sum: { $sum: '$items.quantity' } },
          totalOrders: { $sum: 1 },
        },
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employee' } },
      { $unwind: '$employee' },
      {
        $project: {
          employeeEmail: '$employee.email',
          totalUnits: 1,
          totalOrders: 1,
        },
      },
    ]);
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('employeeId')
      .populate('items.productId')
      .populate('outletId')
      .populate('courierId')
      .populate('createdBy')
      .populate('updatedBy');
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    // Allow if admin or the employee who placed the order
    if (req.user?.role !== 'admin' && order.employeeId._id.toString() !== req.user?.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ message: 'Order deleted (cancelled)' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const updateOrder = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Allowed fields for update (exclude items and totalAmount to avoid stock inconsistencies)
    const allowedUpdates = [
      'customerName', 'customerPhone', 'customerAddress',
      'orderNote', 'riderNote', 'discount', 'courierId', 'verificationCall', 'deliveryStatus'
    ];
    
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => { (obj as any)[key] = (updates as any)[key]; return obj; }, {} as any);
    
    // Recalculate totalAmount if discount changed
    if (updates.discount !== undefined) {
      const order = await Order.findById(id);
      if (order) {
        const originalSubtotal = order.totalAmount + order.discount;
        filteredUpdates.totalAmount = originalSubtotal - updates.discount;
      }
    }
    
    if (updates.deliveryStatus === 'delivered') {
      filteredUpdates.deliveredAt = new Date();
    }
    
    updates.updatedBy = req.user!.id;
    const order = await Order.findByIdAndUpdate(id, filteredUpdates, { new: true })
      .populate('employeeId')
      .populate('items.productId')
      .populate('outletId')
      .populate('courierId')
      .populate('createdBy')
      .populate('updatedBy');
    
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
export const updateOrderItems = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { items, discount, customerName, customerPhone, customerAddress, orderNote, riderNote, courierId, verificationCall, deliveryStatus } = req.body;
    
    const existingOrder = await Order.findById(id).session(session);
    if (!existingOrder) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // 1. Restore stock for existing items
    for (const oldItem of existingOrder.items) {
      await Product.updateOne(
        { _id: oldItem.productId, 'stock.size': oldItem.size },
        { $inc: { 'stock.$.quantity': oldItem.quantity } },
        { session }
      );
    }

    // 2. Deduct stock for new items
    let newSubtotal = 0;
    for (const newItem of items) {
      const product = await Product.findById(newItem.productId).session(session);
      if (!product) throw new Error(`Product ${newItem.productId} not found`);
      
      const stockEntry = product.stock.find(s => s.size === newItem.size);
      if (!stockEntry || stockEntry.quantity < newItem.quantity) {
        throw new Error(`Insufficient stock for ${product.name} size ${newItem.size}`);
      }
      
      await Product.updateOne(
        { _id: newItem.productId, 'stock.size': newItem.size },
        { $inc: { 'stock.$.quantity': -newItem.quantity } },
        { session }
      );
      
      newSubtotal += newItem.quantity * newItem.unitPrice;
    }

    const finalTotal = newSubtotal - (discount || 0);
    
    // 3. Update order
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      items,
      totalAmount: finalTotal,
      discount: discount || 0,
      customerName,
      customerPhone,
      customerAddress,
      orderNote,
      riderNote,
      courierId,
      verificationCall,
      deliveryStatus,
      deliveredAt: deliveryStatus === 'delivered' ? new Date() : undefined,
      updatedBy: req.user!.id
    }, { new: true, session })
      .populate('employeeId')
      .populate('items.productId')
      .populate('outletId')
      .populate('courierId')
      .populate('createdBy')
      .populate('updatedBy');
    
    await session.commitTransaction();
    res.json(updatedOrder);
  } catch (err: any) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};
export const updateDeliveryStatus = async (req: AuthRequest<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    
    const updates: any = { deliveryStatus, updatedBy: req.user!.id };
    if (deliveryStatus === 'delivered') {
      updates.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(id, updates, { new: true })
      .populate('employeeId')
      .populate('items.productId')
      .populate('outletId')
      .populate('courierId')
      .populate('createdBy')
      .populate('updatedBy');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const syncOrdersToPathao = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderIds } = req.body;
    const orders = await Order.find({ _id: { $in: orderIds } })
      .populate('items.productId')
      .populate('outletId');

    const storeId = process.env.PATHAO_STORE_ID;
    if (!storeId) {
      res.status(400).json({ error: 'Pathao store ID not configured' });
      return;
    }

    const pathaoOrders = orders.map(order => {
      const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);
      const itemDescription = order.items
        .map(i => `${(i.productId as any)?.name || 'Item'} x${i.quantity} (${i.size})`)
        .join(', ')
        .substring(0, 255);

      return {
        store_id: Number(storeId),
        merchant_order_id: order._id.toString(),
        recipient_name: order.customerName,
        recipient_phone: order.customerPhone,
        recipient_address: order.customerAddress,
        delivery_type: 48, // Normal Delivery
        item_type: 2, // Parcel
        special_instruction: order.riderNote || '',
        item_quantity: totalQuantity,
        item_weight: '0.5',
        amount_to_collect: order.totalAmount,
        item_description: itemDescription
      };
    });

    const result = await createBulkOrder(pathaoOrders);
    res.json({ success: true, result });
  } catch (err: any) {
    console.error('Pathao API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
};

export const exportOrdersToPathaoCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderIds } = req.query;
    let filter: any = {};
    
    if (orderIds) {
      // Handle array or comma-separated string
      const ids = Array.isArray(orderIds) ? orderIds : (orderIds as string).split(',');
      filter._id = { $in: ids };
    } else {
      const { employeeId, outletId, deliveryStatus, startDate, endDate } = req.query;
      if (employeeId) filter.employeeId = employeeId;
      if (outletId) filter.outletId = outletId;
      if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string);
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);
      }
    }

    const orders = await Order.find(filter)
      .populate('items.productId')
      .sort({ createdAt: -1 });

    const storeId = process.env.PATHAO_STORE_ID;
    if (!storeId) {
      res.status(400).json({ error: 'Pathao store ID not configured' });
      return;
    }

    const csvData = orders.map(order => {
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const itemDescription = order.items
        .map(item => `${(item.productId as any)?.name || 'Item'} x${item.quantity} (${item.size})`)
        .join(', ')
        .substring(0, 255);

      return {
        store_id: storeId,
        merchant_order_id: order._id.toString(),
        recipient_name: order.customerName,
        recipient_phone: order.customerPhone,
        recipient_address: order.customerAddress,
        delivery_type: 48,
        item_type: 2,
        special_instruction: order.riderNote || '',
        item_quantity: totalQuantity,
        item_weight: '0.5',
        amount_to_collect: order.totalAmount,
        item_description: itemDescription
      };
    });

    const parser = new Parser({
      fields: [
        'store_id', 'merchant_order_id', 'recipient_name', 'recipient_phone',
        'recipient_address', 'delivery_type', 'item_type', 'special_instruction',
        'item_quantity', 'item_weight', 'amount_to_collect', 'item_description'
      ]
    });
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=pathao_orders_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFilteredOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      employeeId,
      startDate,
      endDate
    } = req.query;

    const filter: any = {};

    if (search) {
      const searchConditions: any[] = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
      
      if (mongoose.Types.ObjectId.isValid(search as string)) {
        searchConditions.push({ _id: search });
      }
      
      filter.$or = searchConditions;
    }
    
    if (status && status !== 'all') filter.deliveryStatus = status;
    
    // If not admin, restrict to own orders. If admin, allow filtering by employeeId.
    if (req.user?.role !== 'admin') {
      filter.employeeId = req.user!.id;
    } else if (employeeId && employeeId !== 'all') {
      filter.employeeId = employeeId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
      .populate('employeeId')
      .populate('items.productId')
      .populate('outletId')
      .populate('courierId')
      .populate('createdBy')
      .populate('updatedBy')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

