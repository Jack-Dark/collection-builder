import type z from 'zod';

import type { deleteCollectionItemsByIdsSchema } from './delete-collection-items-by-ids.schema';

export type DeleteCollectionItemsByIdsSchemaDef = z.output<
  typeof deleteCollectionItemsByIdsSchema
>;
