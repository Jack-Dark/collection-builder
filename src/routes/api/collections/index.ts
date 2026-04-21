import type { AddCollectionFormSchemaDef } from '#/pages/CollectionsPage/components/AddCollectionForm/types';

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
        const data: AddCollectionFormSchemaDef = await request.json();

        const newRecord = await createCollectionServerFn({ data });

        return Response.json(newRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allCollectionsPaginationParamsSchema,
});
