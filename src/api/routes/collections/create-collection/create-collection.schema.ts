import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const createCollectionBaseSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().describe('Created At'),
  id: z.undefined().describe('ID'),
  userId: z.undefined().describe('User ID'),
});

export const createCollectionFormSchema = createCollectionBaseSchema.extend({
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

export const createCollectionServerFnSchema = createCollectionBaseSchema.extend(
  {
    images: z.array(z.string()).describe('Images'),
  },
);
