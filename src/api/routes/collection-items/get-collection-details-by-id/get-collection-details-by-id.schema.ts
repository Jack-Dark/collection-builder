import z from 'zod';

import type { CollectionItemsTableColumn } from '../collection-item.types';

import { getRequiredPaginationQueriesSchema } from '../../../pagination/pagination.schema';

export const collectionDetailsFiltersSchema = z
  .object({
    customField1: z.array(z.string()).optional().default([]),
    customField2: z.array(z.string()).optional().default([]),
    customField3: z.array(z.string()).optional().default([]),
  })
  .optional()
  .default({
    customField1: [],
    customField2: [],
    customField3: [],
  });

export const collectionDetailsSearchQueriesSchema =
  getRequiredPaginationQueriesSchema<CollectionItemsTableColumn>(
    'customField1Value',
  ).and(
    z.object({
      filters: collectionDetailsFiltersSchema,
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
