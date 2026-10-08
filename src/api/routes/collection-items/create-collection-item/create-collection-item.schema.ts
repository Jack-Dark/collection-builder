import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

export const createCollectionItemsFormSchema = baseCollectionItemSchema.extend({
  id: z.string().describe('ID'),
  images: imagesSchema.filesList,
  isEditing: z.boolean().describe('Is Editing'),
});

// ? Separate schema in order to upload images client-side
export const createCollectionItemsWithFileImagesSchema =
  baseCollectionItemSchema
    .extend({
      images: imagesSchema.filesList,
    })
    .describe('Collection Item')
    .strict();

// ? Handle the rest server-side with uploaded files public IDs
export const createCollectionItemsServerFnSchema = z.object({
  publicIds: z.array(z.array(z.string())),
  records: z
    .array(
      baseCollectionItemSchema
        .extend({
          images: imagesSchema.publicIdsList,
        })
        .describe('Collection Item')
        .strict(),
    )
    .describe('Collection Items'),
});
