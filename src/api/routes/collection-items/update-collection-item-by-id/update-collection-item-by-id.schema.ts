import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

const updateCollectionItemsBaseSchema = baseCollectionItemSchema.extend({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  updatedAt: z.string().describe('Updated At').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionItemsFormSchema =
  updateCollectionItemsBaseSchema.extend({
    images: imagesSchema.filesOrPublicIdsList,
    isEditing: z.boolean().optional().describe('Is Editing'),
  });

export const onUpdateCollectionItemsArgsSchema =
  updateCollectionItemsBaseSchema.extend({
    images: imagesSchema.filesOrPublicIdsList,
  });

export const updateCollectionItemsServerFnSchema = z.object({
  allUploadedPublicIds: z.array(z.array(z.string())),
  records: z.array(
    updateCollectionItemsBaseSchema.extend({
      images: imagesSchema.publicIdsList,
    }),
  ),
});
