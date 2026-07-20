import z from 'zod';

import { createCollectionFormSchema } from '#/api/routes/collections/create-collection/create-collection.schema';

import { updateCollectionsFormRecordSchema } from '../../api/routes/collections/update-collection-by-id/update-collection-by-id.schema';

export const createOrUpdateCollectionFormSchema = z.object({
  records: z.array(
    z.union([createCollectionFormSchema, updateCollectionsFormRecordSchema]),
  ),
});
