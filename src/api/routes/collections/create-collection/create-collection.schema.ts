import z from 'zod';

import { updateCustomFieldFormSchema } from '../../custom-fields/custom-fields.schema';
import { baseCollectionSchema } from '../base-collection.schema';

export const createCollectionFormSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().optional().describe('Created At'),
  customFields: z.array(updateCustomFieldFormSchema).describe('Custom Fields'),
  id: z.string().describe('ID'),
  isEditing: z.boolean().describe('Is Editing'),
  updatedAt: z.undefined().optional().describe('Updated At'),
});

export const createCollectionServerFnSchema = z.object({
  records: z
    .array(
      createCollectionFormSchema.omit({
        createdAt: true,
        id: true,
        isEditing: true,
        updatedAt: true,
      }),
    )
    .min(1),
});
