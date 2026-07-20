import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

export const createCollectionFormSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().optional().describe('Created At'),
  id: z.string().describe('ID'),
  isEditing: z.boolean().describe('Is Editing'),
  updatedAt: z.undefined().optional().describe('Updated At'),
  userId: z.undefined().optional().describe('User ID'),
});

export const onCreateCollectionsArgsSchema = z.object({
  records: z.array(baseCollectionSchema),
});

export const createCollectionServerFnSchema = z.object({
  records: z.array(baseCollectionSchema),
});
