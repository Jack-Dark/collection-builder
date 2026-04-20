import type { AddGameFormSchemaDef } from '#/pages/CollectionsPage/components/AddCollectionForm/types';

import { createFileRoute } from '@tanstack/react-router';
import {
  allCollectionsPaginationParamsSchema,
  createCollectionServerFn,
  fetchAllCollectionsServerFn,
} from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collections/')({
  server: {
    handlers: {
      GET: async () => {
        const searchParams = Route.useSearch();
        // TODO - PASS SEARCH PARAMS IN WITHOUT TS ERROR
        const allCollections = await fetchAllCollectionsServerFn({ data: {} });

        return Response.json(allCollections);
      },
      POST: async ({ request }) => {
        const data: AddGameFormSchemaDef = await request.json();

        const createdGameRecord = await createCollectionServerFn({ data });

        return Response.json(createdGameRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allCollectionsPaginationParamsSchema,
});
