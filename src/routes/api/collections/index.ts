import { createFileRoute } from '@tanstack/react-router';

import type {
  CreateCollectionSchemaDef,
  UpdateCollectionSchemaDef,
} from '#/api/routes/collections/server/types';

import {
  allCollectionsPaginationParamsSchema,
  createCollectionServerFn,
  getAllCollectionsServerFn,
  updateCollectionServerFn,
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
        const data: CreateCollectionSchemaDef = await request.json();

        const newRecord = await createCollectionServerFn({ data });

        return Response.json(newRecord);
      },
      PUT: async ({ request }) => {
        const data: UpdateCollectionSchemaDef = await request.json();

        const newRecord = await updateCollectionServerFn({ data });

        return Response.json(newRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allCollectionsPaginationParamsSchema,
});
