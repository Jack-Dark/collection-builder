import z from 'zod';

import { createCollectionFormSchema } from '#/api/routes/collections/create-collection/create-collection.schema';

import { updateCollectionByIdFormSchema } from '../../api/routes/collections/update-collection-by-id/update-collection-by-id.schema';

export const createOrUpdateCollectionFormSchema = z.union([
  createCollectionFormSchema,
  updateCollectionByIdFormSchema,
]);
