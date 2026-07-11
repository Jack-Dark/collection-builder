import z from 'zod';

import { createSchema } from '#/api/routes/collections/server/create-collection/create-collection.schema';

import { baseCollectionSchema } from '../../api/routes/collections/server/base-collection.schema';
import { updateSchema } from '../../api/routes/collections/server/update-collection-by-id/update-collection-by-id.schema';

// TODO - investigate `and` vs `extend` in zod
export const collectionFormSchema = baseCollectionSchema.and(
  z.union([createSchema, updateSchema]),
);
