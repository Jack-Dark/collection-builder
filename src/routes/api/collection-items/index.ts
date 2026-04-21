import type { CollectionItemRecordDef } from '#/api/routes/collection-items/server/types';
import type { AddCollectionItemFormSchemaDef } from '#/pages/CollectionPage/components/AddCollectionItemForm/types';

import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getOptionalPaginationParamsSchema } from '#/api/pagination/schema';
import { gamesDbQueries } from '#/api/routes/collection-items/server';
import { createCollectionItemServerFn } from '#/api/routes/collection-items/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

const allCollectionItemsSortFields = [
  'name',
  'createdAt',
  'system',
] satisfies (keyof CollectionItemRecordDef)[];

const allCollectionItemsPaginationParamsSchema =
  getOptionalPaginationParamsSchema(allCollectionItemsSortFields);

export const Route = createFileRoute('/api/collection-items/')({
  server: {
    handlers: {
      GET: async () => {
        // @ts-expect-error
        const _searchParams = Route.useSearch();
        // TODO - PASS SEARCH PARAMS IN WITHOUT TS ERROR
        const allRecords = await fetchAllCollectionItems({ data: {} });

        return Response.json(allRecords);
      },
      POST: async ({ request }) => {
        const data: AddCollectionItemFormSchemaDef = await request.json();

        const result = await createCollectionItemServerFn({ data });

        return Response.json(result);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allCollectionItemsPaginationParamsSchema,
});

export const fetchAllCollectionItems = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(allCollectionItemsPaginationParamsSchema)
  .handler(async ({ context, data: params }) => {
    return gamesDbQueries.getAllCollectionItemsQuery({
      params,
      userId: context.user.id,
    });
  });
