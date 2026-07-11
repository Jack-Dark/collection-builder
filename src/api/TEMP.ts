import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { getItemsByCollectionIdQuery } from '#/api/routes/collection-items/server/queries';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { requiredPaginationQueriesSchema } from './pagination/pagination.schema';

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

const getItemsByCollectionIdSchema = z.object({
  collectionId: z.number(),
  params: collectionItemsSearchQueriesSchema,
});

export const getItemsByCollectionIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getItemsByCollectionIdSchema)
  .handler(async ({ context, data: { collectionId, params } }) => {
    return getItemsByCollectionIdQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });

export type CollectionItemsFiltersSchemaDef = z.output<
  typeof collectionItemsFiltersSchema
>;

export type CollectionItemsSearchQueriesSchemaDef = z.output<
  typeof collectionItemsSearchQueriesSchema
>;
