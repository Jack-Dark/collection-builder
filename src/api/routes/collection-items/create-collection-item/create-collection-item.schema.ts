import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

export const createCollectionItemsFormSchema = baseCollectionItemSchema.extend({
  createdAt: z.undefined().optional().describe('Created At'),
  id: z.string().describe('ID'),
  images: imagesSchema.filesList,
  isEditing: z.boolean().describe('Is Editing'),
  updatedAt: z.undefined().optional().describe('Updated At'),
  userId: z.undefined().optional().describe('User ID'),
});

export const onCreateCollectionItemsArgsSchema =
  baseCollectionItemSchema.extend({
    images: imagesSchema.filesList,
  });

export const createCollectionItemsServerFnSchema = z.object({
  publicIds: z.array(z.array(z.string())),
  records: z.array(
    baseCollectionItemSchema.extend({
      images: imagesSchema.publicIdsList,
    }),
  ),
});
