import z from 'zod';

import { customFieldWithIdSchema } from '../../custom-fields/custom-fields.schema';
import { baseCollectionSchema } from '../base-collection.schema';

export const createCollectionFormSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().optional().describe('Created At'),
  customFields: z.array(customFieldWithIdSchema).describe('Custom Fields'),
  id: z.string().describe('ID'),
  isEditing: z.boolean().describe('Is Editing'),
  updatedAt: z.undefined().optional().describe('Updated At'),
  userId: z.undefined().optional().describe('User ID'),
});

export const createCollectionServerFnSchema = z.object({
  records: z
    .array(
      createCollectionFormSchema.omit({
        createdAt: true,
        id: true,
        isEditing: true,
        updatedAt: true,
        userId: true,
      }),
    )
    .min(1),
});

export const createCollectionDbArgsSchema = z
  .array(
    createCollectionFormSchema
      .omit({
        createdAt: true,
        id: true,
        isEditing: true,
        updatedAt: true,
        userId: true,
      })
      .extend({
        userId: z.string().min(1).describe('User ID'),
      }),
  )
  .min(1);
