import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const createCollectionBaseSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().describe('Created At'),
  id: z.undefined().describe('ID'),
  userId: z.undefined().describe('User ID'),
});

export const createCollectionFormSchema = createCollectionBaseSchema;

export const createCollectionServerFnSchema = createCollectionBaseSchema;
