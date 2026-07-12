import z from 'zod';

import { baseCollectionItemSchema } from '#/api/routes/collection-items/base-collection-item.schema';
import { createItemAttrsSchema } from '#/api/routes/collection-items/create-collection-item/create-collection-item.schema';
import { updateItemAttrsSchema } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.schema';

export const addOrUpdateCollectionItemFormSchema = baseCollectionItemSchema.and(
  z.union([createItemAttrsSchema, updateItemAttrsSchema]),
);
