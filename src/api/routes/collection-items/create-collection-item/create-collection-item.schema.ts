import z from 'zod';

import { baseCollectionItemSchema } from '../base-collection-item.schema';

const createCollectionItemBaseSchema = baseCollectionItemSchema.extend({
  createdAt: z.undefined().describe('Created At'),
  userId: z.undefined().describe('User ID'),
});

export const createCollectionItemFormSchema =
  createCollectionItemBaseSchema.extend({
    collectionId: z.undefined().describe('Collection ID'),
    id: z.string().describe('ID'),
    images: z
      .array(
        z.union([
          z.string(),
          z.object({
            file: z.file(),
            previewUrl: z.string(),
          }),
        ]),
      )
      .describe('Images'),
  });

export const createCollectionItemServerFnSchema =
  createCollectionItemBaseSchema.extend({
    collectionId: z.number().describe('Collection ID'),
    id: z.never().describe('ID'),
    images: z.array(z.string()).describe('Images'),
  });
