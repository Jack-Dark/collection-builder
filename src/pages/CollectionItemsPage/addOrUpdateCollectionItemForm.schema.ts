import z from 'zod';

import {
  createItemAttrsSchema,
  updateItemAttrsSchema,
} from '#/api/routes/collection-items/server/serverFns';
import { baseCollectionItemSchema } from '#/api/routes/collection-items/base-collection-item.schema';

export const addOrUpdateCollectionItemFormSchema = baseCollectionItemSchema.and(
  z.union([createItemAttrsSchema, updateItemAttrsSchema]),
);
