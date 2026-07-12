import z from 'zod';

import { baseCollectionItemSchema } from '../base-collection-item.schema';

export const createItemAttrsSchema = z.object({
  createdAt: z.undefined(),
  id: z.undefined(),
  userId: z.undefined(),
});

export const createCollectionItemSchema = baseCollectionItemSchema.extend(
  createItemAttrsSchema.shape,
);
