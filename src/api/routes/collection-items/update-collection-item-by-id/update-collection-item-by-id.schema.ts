import z from 'zod';

import { baseCollectionItemSchema } from '../base-collection-item.schema';

export const updateItemAttrsSchema = z.object({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionItemFormSchema = baseCollectionItemSchema.extend(
  updateItemAttrsSchema.shape,
);

const { images: _images, ...rest } = updateCollectionItemFormSchema.shape;

export const updateCollectionItemByIdSchema = z.object({
  ...rest,
  images: z.array(z.string()).describe('Images'),
});
