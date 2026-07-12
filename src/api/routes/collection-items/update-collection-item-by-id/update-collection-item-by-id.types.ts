import type z from 'zod';

import type { updateCollectionItemByIdSchema } from './update-collection-item-by-id.schema';

export type UpdateCollectionItemSchemaDef = z.output<
  typeof updateCollectionItemByIdSchema
>;
