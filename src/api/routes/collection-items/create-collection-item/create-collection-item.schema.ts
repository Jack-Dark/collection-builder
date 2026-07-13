import z from 'zod';

import { baseCollectionItemSchema } from '../base-collection-item.schema';

export const createItemAttrsSchema = z.object({
  createdAt: z.undefined(),
  id: z.undefined(),
  userId: z.undefined(),
});

export const createCollectionItemFormSchema = baseCollectionItemSchema.extend(
  createItemAttrsSchema.shape,
);

const { images: _images, ...rest } = createCollectionItemFormSchema.shape;

export const createCollectionItemSchema = z.object({
  ...rest,
  images: z.array(z.string()).describe('Images'),
});
