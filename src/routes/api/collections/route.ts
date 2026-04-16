import type { CollectionRecordDef } from '#/api/routes/collections/server/types';

import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getOptionalPaginationParamsSchema } from '#/api/pagination/schema';
import { apiRoutes } from '#/api/routes';
import { collectionsDbQueries } from '#/api/routes/collections/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

const allCollectionsSortFields = [
  'name',
  'createdAt',
] satisfies (keyof CollectionRecordDef)[];

const allCollectionsPaginationParamsSchema = getOptionalPaginationParamsSchema(
  allCollectionsSortFields,
);

export const Route = createFileRoute('/api/collections')({
  server: {
    handlers: {
      GET: async () => {
        const searchParams = Route.useSearch();
        // TODO - PASS SEARCH PARAMS IN WITHOUT TS ERROR
        const allCollections = await fetchAllCollections({ data: {} });

        return Response.json(allCollections);
      },
      POST: async ({ request }) => {
        type CreateNewGameDataDef = Parameters<
          typeof createNewCollection
        >[0]['data'];

        const data: CreateNewGameDataDef = await request.json();

        const createdGameRecord = await createNewCollection({ data });

        return Response.json(createdGameRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allCollectionsPaginationParamsSchema,
});

export const fetchAllCollections = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(allCollectionsPaginationParamsSchema)
  .handler(async ({ context, data: params }) => {
    return collectionsDbQueries.getAllCollections({
      params,
      userId: context.user.id,
    });
  });

export const createNewCollection = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(apiRoutes.collections.createSchema)
  .handler(async ({ context, data: gameDetails }) => {
    return collectionsDbQueries.createCollection({
      ...gameDetails,
      userId: context.user.id,
    });
  });
