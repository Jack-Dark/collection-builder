import type z from 'zod';

import type { deleteCollectionItemByIdSchema } from './delete-collection-item-by-id.schema';

export type DeleteCollectionItemByIdSchemaDef = z.output<
  typeof deleteCollectionItemByIdSchema
>;
