import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

export const createSchema = z.object({
  createdAt: z.undefined(),
  id: z.undefined(),
  userId: z.undefined(),
});

export const createCollectionSchema = baseCollectionSchema.extend(
  createSchema.shape,
);
