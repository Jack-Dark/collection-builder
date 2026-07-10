import { createFileRoute } from '@tanstack/react-router';

import { getItemsByCollectionId } from '#/api/routes/collection-items/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { collectionItemsSearchQueriesSchema } from '.';

export const Route = createFileRoute('/api/collections/$id/items')({
  loaderDeps: ({ search }) => {
    return {
      filters: search.filters,
      limit: search.limit,
      page: search.page,
      search: search.search,
      sort: search.sort,
    };
  },
  server: {
    handlers: {
      GET: async ({ params }) => {
        const collectionId = Number(params.id);

        const data = await getItemsByCollectionId({
          data: {
            collectionId,
            params: {
              // TODO
            },
          },
        });

        if (!data) {
          return Response.json({});
        }

        return Response.json(data);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: collectionItemsSearchQueriesSchema,
});
