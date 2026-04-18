import { z } from 'zod';

export const createEmployeeSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    profileImage: z.string().optional(),
    role: z.enum(['admin', 'employee']).optional()
  })
});

export const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    profileImage: z.string().optional(),
    role: z.enum(['admin', 'employee']).optional()
  })
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>['body'];
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>['body'];
