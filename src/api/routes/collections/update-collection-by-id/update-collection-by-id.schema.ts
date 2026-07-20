import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const updateCollectionsBaseSchema = baseCollectionSchema.extend({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  isEditing: z.boolean().optional().describe('Is Editing'),
  updatedAt: z.string().describe('Updated At').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionsFormRecordSchema = updateCollectionsBaseSchema;

export const onUpdateCollectionsArgsSchema = z.object({
  records: z.array(updateCollectionsBaseSchema),
});

export const updateCollectionsServerFnSchema = z.object({
  records: z.array(updateCollectionsBaseSchema),
});
