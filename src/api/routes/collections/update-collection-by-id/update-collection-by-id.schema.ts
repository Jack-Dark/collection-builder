import z from 'zod';

import {
  baseCollectionSchema,
  customFieldWithIdSchema,
} from '../base-collection.schema';

const updateCollectionsBaseSchema = baseCollectionSchema.extend({
  createdAt: z.date().describe('Created At').min(1),
  customFields: z.array(customFieldWithIdSchema).describe('IDs'),
  id: z.number().describe('ID').min(1),
  isEditing: z.boolean().optional().describe('Is Editing'),
  updatedAt: z.date().describe('Updated At').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionsFormRecordSchema = updateCollectionsBaseSchema;

export const onUpdateCollectionsArgsSchema = z.object({
  records: z.array(updateCollectionsBaseSchema),
});

export const updateCollectionsServerFnSchema = z.object({
  records: z.array(updateCollectionsBaseSchema),
});
