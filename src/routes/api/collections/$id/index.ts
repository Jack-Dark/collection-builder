import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import type { UpdateCollectionItemRecordDef } from '#/api/routes/collection-items/server/types';

import { sortDirectionOptions } from '#/api/pagination/constants';
import { collectionItemsDbQueries } from '#/api/routes/collection-items/server';
import { collectionsDbQueries } from '#/api/routes/collections/server';
import { requireCollectionIdSchema } from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collections/$id/')({
  server: {
    handlers: {
      DELETE: async ({ context, params }) => {
        const id = Number(params.id);

        await collectionItemsDbQueries.softDeleteCollectionItemByIdQuery({
          id,
          userId: context.user.id,
        });

        return Response.json({ message: 'Collection deleted successfully' });
      },
      GET: async ({ params }) => {
        const id = Number(params.id);

        const data = await getCollectionById({ data: { collectionId: id } });

        if (!data) {
          return Response.json({});
        }

        return Response.json(data);
      },
      PUT: async ({ context, params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: UpdateCollectionItemRecordDef = await request.json();

        const updatedRecord =
          await collectionItemsDbQueries.updateCollectionItemQuery({
            ...gameDetails,
            id,
            userId: context.user.id,
          });

        return Response.json(updatedRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});

export const getCollectionById = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return collectionsDbQueries.getCollectionById({
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

const sortSchema = z
  .object({
    direction: z.union([
      z.literal('ASC'),
      z.literal('asc'),
      z.literal('DESC'),
      z.literal('desc'),
    ]),
    field: z.string(),
  })
  .optional()
  .default({
    direction: 'ASC',
    field: 'name',
  });

const searchSchema = z.string().optional().default('');

export const collectionItemsSearchQueriesSchema = z
  .object({
    filters: collectionItemsFiltersSchema,
    limit: z.number().min(1).optional().default(100),
    page: z.number().min(1).optional().default(1),
    search: searchSchema,
    sort: sortSchema,
  })
  .default({
    filters: {
      customField1: [],
      customField2: [],
      customField3: [],
    },
    limit: 100,
    page: 1,
    search: '',
    sort: {
      direction: sortDirectionOptions.asc,
      field: 'name',
    },
  });

export type CollectionItemsFiltersSchema = z.Infer<
  typeof collectionItemsFiltersSchema
>;

export type CollectionItemsSearchQueriesSchema = z.Infer<
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
    return collectionItemsDbQueries.getItemsByCollectionIdQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });
