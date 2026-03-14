import { z } from "zod";

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name is too short"),
    description: z.string().optional()
  })
});

export const subCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    parentCategory: z.string().min(24, "Invalid Parent Category ID")
  })
});

export const sizeSchema = z.object({
  body: z.object({
    label: z.string().min(1, "Size label is required"),
    description: z.string().optional() 
  })
});

export const vendorSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Vendor name is required"),
    contactEmail: z.string().email("Invalid email address"),
    logo: z.string().optional()
  })
});