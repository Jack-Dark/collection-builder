import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

const createCollectionItemBaseSchema = baseCollectionItemSchema.extend({
  collectionId: z.number().min(1).describe('Collection ID'),
  createdAt: z.undefined().optional().describe('Created At'),
  updatedAt: z.undefined().optional().describe('Updated At'),
  userId: z.undefined().optional().describe('User ID'),
});

export const createCollectionItemFormSchema =
  createCollectionItemBaseSchema.extend({
    id: z.string().describe('ID'),
    images: imagesSchema.form,
  });

export const createCollectionItemServerFnSchema =
  createCollectionItemBaseSchema.extend({
    id: z.undefined().optional().describe('ID'),
    images: imagesSchema.serverFn,
  });
