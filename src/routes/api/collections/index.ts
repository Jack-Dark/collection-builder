import { createFileRoute } from '@tanstack/react-router';

import type { AddCollectionFormSchemaDef } from '#/pages/CollectionsPage/components/AddCollectionForm/types';

import {
  allCollectionsPaginationParamsSchema,
  createCollectionServerFn,
  getAllCollectionsServerFn,
} from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collections/')({
  server: {
    handlers: {
      GET: async () => {
        // @ts-expect-error
        const _searchParams = Route.useSearch();
        // TODO - PASS SEARCH PARAMS IN WITHOUT TS ERROR
        const allCollections = await getAllCollectionsServerFn({ data: {} });

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
