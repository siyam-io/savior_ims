import { z } from 'zod';

export const outletSchema = z.object({
  body: z.object({
    name: z.string().min(1)
  })
});

export const updateOutletSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(1)
  })
});

export type OutletInput = z.infer<typeof outletSchema>['body'];
