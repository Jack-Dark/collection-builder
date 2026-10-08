import z from 'zod';

import type { CollectionItemsTableColumn } from '../collection-item.types';

import { getRequiredPaginationQueriesSchema } from '../../../pagination/pagination.schema';

export const collectionDetailsFiltersSchema = z
  .object({})
  .optional()
  .default({});

export const collectionDetailsSearchQueriesSchema =
  getRequiredPaginationQueriesSchema<CollectionItemsTableColumn>('name').and(
    z.object({
      // filters: collectionDetailsFiltersSchema,
      searchNotes: z
        .boolean()
        .describe('Include "Notes" in search')
        .default(false),
    }),
  );

export const getCollectionDetailsByIdSchema = z.object({
  collectionId: z.number(),
  params: collectionDetailsSearchQueriesSchema,
});
