import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { sortDirectionOptions } from '#/api/pagination/constants';
import { getItemsByCollectionIdQuery } from '#/api/routes/collection-items/server/queries';
import { getCollectionById } from '#/api/routes/collections/server/queries';
import { requireCollectionIdSchema } from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

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

const sortSchema = z
  .object({
    direction: z.union([
      z.literal(sortDirectionOptions.asc),
      z.literal(sortDirectionOptions.desc),
    ]),
    field: z.string(),
  })
  .optional()
  .default({
    direction: 'asc',
    field: 'name',
  });

export type SortSchemaDef = z.output<typeof sortSchema>;

const searchSchema = z.string().optional().default('');

export type SearchSchemaDef = z.output<typeof searchSchema>;

export const collectionItemsSearchQueriesSchema = z.object({
  filters: collectionItemsFiltersSchema,
  limit: z.number().min(1).optional().default(100),
  page: z.number().min(1).optional().default(1),
  search: searchSchema,
  sort: sortSchema,
});

export type CollectionItemsSearchQueriesSchemaDef = z.output<
  typeof collectionItemsSearchQueriesSchema
>;

export const getItemsByCollectionId = createServerFn({
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
