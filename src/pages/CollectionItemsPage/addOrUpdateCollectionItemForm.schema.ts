import z from 'zod';

import {
  baseCollectionItemSchema,
  createItemAttrsSchema,
  updateItemAttrsSchema,
} from '#/api/routes/collection-items/server/serverFns';

export const addOrUpdateCollectionItemFormSchema = baseCollectionItemSchema.and(
  z.union([createItemAttrsSchema, updateItemAttrsSchema]),
);
