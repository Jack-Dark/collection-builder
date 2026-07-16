import z from 'zod';

import { createCollectionItemFormSchema } from '#/api/routes/collection-items/create-collection-item/create-collection-item.schema';
import { updateCollectionItemFormSchema } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.schema';

export const createOrUpdateCollectionItemFormSchema = z.union([
  createCollectionItemFormSchema,
  updateCollectionItemFormSchema,
]);
