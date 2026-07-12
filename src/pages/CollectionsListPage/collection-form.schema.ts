import z from 'zod';

import { createSchema } from '#/api/routes/collections/create-collection/create-collection.schema';

import { baseCollectionSchema } from '../../api/routes/collections/base-collection.schema';
import { updateSchema } from '../../api/routes/collections/update-collection-by-id/update-collection-by-id.schema';

export const collectionFormSchema = baseCollectionSchema.and(
  z.union([createSchema, updateSchema]),
);
