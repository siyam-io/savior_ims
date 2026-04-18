import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'employee']).optional(),
    assignedOutlets: z.array(z.string()).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];
