import type z from 'zod';

import type {
  updateCollectionItemByIdSchema,
  updateCollectionItemFormSchema,
} from './update-collection-item-by-id.schema';

export type UpdateCollectionItemSchemaDef = z.output<
  typeof updateCollectionItemFormSchema
>;

export type UpdateCollectionItemByIdRequestArgsDef = z.output<
  typeof updateCollectionItemByIdSchema
>;
