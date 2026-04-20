import type { GameRecordDef } from '#/api/routes/collection-items/server/types';
import type { AddGameFormSchemaDef } from '#/pages/CollectionPage/components/AddGameForm/types';

import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getOptionalPaginationParamsSchema } from '#/api/pagination/schema';
import { gamesDbQueries } from '#/api/routes/collection-items/server';
import { createCollectionItemServerFn } from '#/api/routes/collection-items/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

const allGamesSortFields = [
  'name',
  'createdAt',
  'system',
] satisfies (keyof GameRecordDef)[];

const allGamesPaginationParamsSchema =
  getOptionalPaginationParamsSchema(allGamesSortFields);

export const Route = createFileRoute('/api/collection-items/')({
  server: {
    handlers: {
      GET: async () => {
        const searchParams = Route.useSearch();
        // TODO - PASS SEARCH PARAMS IN WITHOUT TS ERROR
        const allGames = await fetchAllGames({ data: {} });

        return Response.json(allGames);
      },
      POST: async ({ request }) => {
        const data: AddGameFormSchemaDef = await request.json();

        const result = await createCollectionItemServerFn({ data });

        return Response.json(result);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
  validateSearch: allGamesPaginationParamsSchema,
});

export const fetchAllGames = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(allGamesPaginationParamsSchema)
  .handler(async ({ context, data: params }) => {
    return gamesDbQueries.getAllGames({
      params,
      userId: context.user.id,
    });
  });
