import z from 'zod';

import { requiredPaginationQueriesSchema } from '../../../pagination/pagination.schema';

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
  requiredPaginationQueriesSchema.extend({
    filters: collectionItemsFiltersSchema,
  });

export const getItemsByCollectionIdSchema = z.object({
  collectionId: z.number(),
  params: collectionItemsSearchQueriesSchema,
});
