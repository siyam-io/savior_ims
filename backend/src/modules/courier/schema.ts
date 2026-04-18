import { z } from 'zod';

export const courierSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    charge: z.number().min(0)
  })
});

export const updateCourierSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    charge: z.number().min(0).optional()
  })
});

export type CourierInput = z.infer<typeof courierSchema>['body'];
