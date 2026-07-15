import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const updateCollectionByIdBaseSchema = baseCollectionSchema.extend({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionByIdFormSchema =
  updateCollectionByIdBaseSchema.extend({
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

export const updateCollectionByIdServerFnSchema =
  updateCollectionByIdBaseSchema.extend({
    images: z.array(z.string()).describe('Images'),
  });
