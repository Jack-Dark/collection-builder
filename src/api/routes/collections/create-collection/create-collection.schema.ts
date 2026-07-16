import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const createCollectionBaseSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().optional().describe('Created At'),
  updatedAt: z.undefined().optional().describe('Updated At'),
  userId: z.undefined().optional().describe('User ID'),
});

export const createCollectionFormSchema = createCollectionBaseSchema.extend({
  id: z.string().describe('ID'),
});

export const createCollectionServerFnSchema = createCollectionBaseSchema.extend(
  {
    id: z.undefined().optional().describe('ID'),
  },
);
