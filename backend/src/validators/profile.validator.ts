import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});
