import { z } from 'zod';

const stockItemSchema = z.object({
  size: z.string(),
  quantity: z.number().min(0)
});

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    description: z.string().optional(),
    categoryId: z.string(),
    subcategory: z.string(),
    activatedSizes: z.array(z.string()),
    visuals: z.array(z.string()).optional(),
    stock: z.array(stockItemSchema).optional()
  })
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    subcategory: z.string().optional(),
    activatedSizes: z.array(z.string()).optional(),
    visuals: z.array(z.string()).optional(),
    stock: z.array(stockItemSchema).optional()
  })
});

export type ProductInput = z.infer<typeof productSchema>['body'];
