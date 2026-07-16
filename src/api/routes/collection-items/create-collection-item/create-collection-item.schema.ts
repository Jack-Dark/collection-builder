import z from 'zod';

import { baseCollectionItemSchema } from '../base-collection-item.schema';

const createCollectionItemBaseSchema = baseCollectionItemSchema.extend({
  collectionId: z.number().describe('Collection ID'),
  createdAt: z.undefined().optional().describe('Created At'),
  updatedAt: z.undefined().optional().describe('Updated At'),
  userId: z.undefined().optional().describe('User ID'),
});

export const createCollectionItemFormSchema =
  createCollectionItemBaseSchema.extend({
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
    id: z.undefined().optional().describe('ID'),
    images: z.array(z.string()).describe('Images'),
  });
