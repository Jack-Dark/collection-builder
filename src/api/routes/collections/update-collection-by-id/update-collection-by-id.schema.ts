import z from 'zod';

import {
  customFieldDetailsSchema,
  customFieldWithIdSchema,
} from '../../custom-fields/custom-fields.schema';
import { baseCollectionSchema } from '../base-collection.schema';

export const updateCollectionsFormRecordSchema = baseCollectionSchema.extend({
  createdAt: z.date().describe('Created At').min(1),
  customFields: z
    .array(
      customFieldWithIdSchema.extend({
        details: customFieldDetailsSchema,
      }),
    )
    .describe('Custom Fields'),
  id: z.number().describe('ID').min(1),
  isEditing: z.boolean().optional().describe('Is Editing'),
  updatedAt: z.date().describe('Updated At').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const onUpdateCollectionsArgsSchema = z.object({
  records: z.array(updateCollectionsFormRecordSchema),
});

export const updateCollectionsServerFnSchema = z.object({
  records: z.array(updateCollectionsFormRecordSchema),
});
