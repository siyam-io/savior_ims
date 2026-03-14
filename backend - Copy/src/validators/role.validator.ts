import { z } from "zod";

export const roleSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Role name is required"),
    permissions: z.array(z.string()).min(1, "At least one permission is required"),
    isActive: z.boolean().optional()
  })
});