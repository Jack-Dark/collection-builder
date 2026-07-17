import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

const updateCollectionBaseSchema = baseCollectionItemSchema.extend({
  collectionId: z.number().min(1).describe('Collection ID'),
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  updatedAt: z.string().describe('Updated At').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionItemFormSchema = updateCollectionBaseSchema.extend(
  {
    images: imagesSchema.form,
  },
);

export const updateCollectionItemByIdServerFnSchema =
  updateCollectionBaseSchema.extend({
    images: imagesSchema.serverFn,
  });
