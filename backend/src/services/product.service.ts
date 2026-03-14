import { Product, IProduct } from "../models/Product";
import { InventoryLog } from "../models/InventoryLog";

export const createProduct = async (data: Partial<IProduct>) => {
  console.log('Data to be saved:', data);
  const product = new Product(data);
  return await product.save();
};

export const getProducts = async (queryParams: any) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    category, 
    subCategory, 
    size,
    vendor,
    vendorId // For vendor isolation
  } = queryParams;

  const filter: any = {};

  // Vendor isolation
  if (vendorId) {
    filter.vendor = vendorId;
  }

  // Search Logic
  if (search) {
    filter.$or = [
      { productName: { $regex: search, $options: "i" } },
      { fabric: { $regex: search, $options: "i" } }
    ];
  }

  // Filter Logic
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (vendor) filter.vendor = vendor;
  
  // Size filter
  if (size) {
    filter["inventory.size"] = size;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("vendor", "name")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("inventory.size", "label")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

export const getProductById = async (id: string) => {
  return await Product.findById(id)
    .populate("vendor", "name")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("inventory.size", "label");
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  // If new image is uploaded, delete old one (handled in controller)
  Object.assign(product, data);
  
  return await product.save();
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  
  // Delete product and related logs
  await InventoryLog.deleteMany({ product: id });
  return await Product.findByIdAndDelete(id);
};

export const updateInventory = async (
  productId: string, 
  sizeId: string, 
  quantity: number, 
  userId: string
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const sizeIndex = product.inventory.findIndex(
    (item) => item.size.toString() === sizeId
  );

  let previousStock = 0;
  let newStock = 0;

  if (sizeIndex > -1) {
    previousStock = product.inventory[sizeIndex].quantity;
    product.inventory[sizeIndex].quantity += quantity;
    newStock = product.inventory[sizeIndex].quantity;
    
    // Remove size if quantity becomes 0 or negative
    if (newStock <= 0) {
      product.inventory.splice(sizeIndex, 1);
      newStock = 0;
    }
  } else {
    if (quantity > 0) {
      previousStock = 0;
      product.inventory.push({ size: sizeId as any, quantity });
      newStock = quantity;
    } else {
      throw new Error("Size not found in inventory, and quantity is not positive.");
    }
  }

  product.lastUpdatedBy = userId as any;
  await product.save();

  // Create inventory log
  await InventoryLog.create({
    product: productId,
    size: sizeId,
    user: userId,
    type: quantity > 0 ? 'in' : 'out',
    quantity: Math.abs(quantity),
    previousStock,
    newStock,
    note: `Manual stock adjustment by user`
  });

  return product;
};

export const getInventoryLogs = async (
  productId?: string, 
  sizeId?: string,
  userId?: string
) => {
  const filter: any = {};
  
  if (productId) filter.product = productId;
  if (sizeId) filter.size = sizeId;
  if (userId) filter.user = userId;
  
  return await InventoryLog.find(filter)
    .populate('product', 'productName')
    .populate('size', 'label')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};