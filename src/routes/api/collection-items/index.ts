import { createFileRoute } from '@tanstack/react-router';

import type {
  CreateCollectionItemSchemaDef,
  UpdateCollectionItemSchemaDef,
} from '#/api/routes/collection-items/server/types';

import {
  createCollectionItemServerFn,
  updateCollectionItemServerFn,
} from '#/api/routes/collection-items/server/serverFns';
import { allCollectionsPaginationParamsSchema } from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collection-items/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const data: CreateCollectionItemSchemaDef = await request.json();

        const newRecord = await createCollectionItemServerFn({ data });

        return Response.json(newRecord);
      },
      PUT: async ({ request }) => {
        const data: UpdateCollectionItemSchemaDef = await request.json();

        const newRecord = await updateCollectionItemServerFn({ data });

        return Response.json(newRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allCollectionsPaginationParamsSchema,
});
