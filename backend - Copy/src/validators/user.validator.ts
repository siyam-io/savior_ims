import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.string().min(24).optional(),
    vendorId: z.string().min(24).optional(),
    status: z.enum(['active', 'inactive']).optional()
  })
});