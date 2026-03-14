import { Product, IProduct } from "../models/Product";

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
    vendor 
  } = queryParams;

  const filter: any = {};

  // 1. Search Logic (Product Name or Fabric)
  if (search) {
    filter.productName = { $regex: search, $options: "i" };
  }

  // 2. Filter Logic
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (vendor) filter.vendor = vendor;
  
  // Size filter (Matching size inside inventory array)
  if (size) {
    filter["inventory.size"] = size;
  }

  // 3. Pagination Logic
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

  Object.assign(product, data);
  
  return await product.save(); 
};

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};

// export const updateInventory = async (productId: string, sizeId: string, quantity: number, userId: string) => {

//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new Error("Product not found");
//   }

//   const sizeIndex = product.inventory.findIndex(
//     (item) => item.size.toString() === sizeId
//   );

//   if (sizeIndex > -1) {
//     product.inventory[sizeIndex].quantity += quantity;
//   } else {
//     if (quantity > 0) {
//       product.inventory.push({ size: sizeId as any, quantity });
//     } else {
//       throw new Error("Size not found in inventory, and quantity is not positive.");
//     }
//   }

//   product.lastUpdatedBy = userId as any;
//   await product.save();
//   return product;
// };





// In product.service.ts - update the updateInventory function

import { InventoryLog } from "../models/InventoryLog";

export const updateInventory = async (productId: string, sizeId: string, quantity: number, userId: string) => {
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

  // CREATE INVENTORY LOG HERE
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