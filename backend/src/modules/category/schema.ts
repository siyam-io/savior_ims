import { z } from 'zod';

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    subcategories: z.array(z.string()),
    sizes: z.array(z.string())
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    subcategories: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional()
  })
});

export type CategoryInput = z.infer<typeof categorySchema>['body'];
