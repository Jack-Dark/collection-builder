import z from 'zod';

import { optionalPaginationQueriesSchema } from '../../../pagination/pagination.schema';

export const collectionItemsFiltersSchema = z
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

export const collectionItemsSearchQueriesSchema =
  optionalPaginationQueriesSchema.and(
    z
      .object({
        filters: collectionItemsFiltersSchema,
      })
      .optional(),
  );

export const getCollectionDetailsByIdSchema = z.object({
  collectionId: z.number(),
  params: collectionItemsSearchQueriesSchema,
});
