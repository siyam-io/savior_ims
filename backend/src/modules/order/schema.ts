import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string(),
  size: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().positive()
});

export const placeOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema),
    outletId: z.string(),
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    customerAddress: z.string().min(1),
    orderNote: z.string().optional(),
    riderNote: z.string().optional(),
    discount: z.number().min(0).optional(),
    courierId: z.string().optional(),
    verificationCall: z.boolean().optional().default(false)
  })
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>['body'];
