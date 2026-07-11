import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

export const updateSchema = z.object({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionByIdSchema = baseCollectionSchema.extend(
  updateSchema.shape,
);
