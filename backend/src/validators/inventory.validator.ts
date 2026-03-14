import { z } from "zod";

export const updateInventorySchema = z.object({
  body: z.object({
    sizeId: z.string().min(24, "Invalid Size ID"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    type: z.enum(['in', 'out'], { required_error: "Adjustment type is required" })
  }),
});