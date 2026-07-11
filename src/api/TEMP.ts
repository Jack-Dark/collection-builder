import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { getItemsByCollectionIdQuery } from '#/api/routes/collection-items/server/queries';
import { getCollectionById } from '#/api/routes/collections/server/queries';
import { requireCollectionIdSchema } from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { requiredPaginationQueriesSchema } from './pagination/pagination.schema';

export const getCollectionByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return getCollectionById({
      id: collectionId,
      userId: context.user.id,
    });
  });

const collectionItemsFiltersSchema = z
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

export type CollectionItemsFiltersSchemaDef = z.output<
  typeof collectionItemsFiltersSchema
>;

export const collectionItemsSearchQueriesSchema =
  requiredPaginationQueriesSchema.extend({
    filters: collectionItemsFiltersSchema,
  });

export type CollectionItemsSearchQueriesSchemaDef = z.output<
  typeof collectionItemsSearchQueriesSchema
>;

export const getItemsByCollectionIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(
    requireCollectionIdSchema.extend({
      params: collectionItemsSearchQueriesSchema,
    }),
  )
  .handler(async ({ context, data: { collectionId, params } }) => {
    return getItemsByCollectionIdQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });
