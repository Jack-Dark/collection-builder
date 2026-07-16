import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const createCollectionBaseSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().describe('Created At'),
  userId: z.undefined().describe('User ID'),
});

export const createCollectionFormSchema = createCollectionBaseSchema.extend({
  id: z.string().describe('ID'),
});

export const createCollectionServerFnSchema = createCollectionBaseSchema.extend(
  {
    id: z.undefined().describe('ID'),
  },
);
