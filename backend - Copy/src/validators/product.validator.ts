import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const productSchema = z.object({
  body: z.object({
    vendor: z.string().regex(objectIdRegex, "Invalid Vendor ID"),
    category: z.string().regex(objectIdRegex, "Invalid Category ID"),
    
    // Sub-category handle (empty string check)
    subCategory: z.preprocess(
      (val) => (val === '' || val === 'undefined' || val === 'null' ? undefined : val), 
      z.string().regex(objectIdRegex).optional()
    ),

    productName: z.string().min(2, "Product name is too short"),
    fabric: z.string().optional(),
    
    // 🔥 Coerce ব্যবহার করে String কে Number এ রূপান্তর (Price)
    price: z.coerce.number({ invalid_type_error: "Price must be a number" }).min(0, "Price cannot be negative"),
    
    // Inventory JSON String থেকে Parse এবং Quantity রূপান্তর
    inventory: z.preprocess((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return []; }
      }
      return val;
    }, z.array(z.object({
      size: z.string().regex(objectIdRegex, "Invalid Size ID"),
      // 🔥 Coerce ব্যবহার করে Quantity রূপান্তর
      quantity: z.coerce.number().min(0, "Quantity cannot be negative")
    })).min(1, "At least one size variant is required")),
    
    image: z.string().optional(),
    videoLink: z.string().optional()
  })
});

// Update Schema এর জন্য (Partial)
export const updateProductSchema = z.object({
  body: productSchema.shape.body.partial()
});