import type { GameRecordDef } from '#/api/routes/games/server/types';

import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getOptionalPaginationParamsSchema } from '#/api/pagination/schema';
import { apiRoutes } from '#/api/routes';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

const allGamesSortFields = [
  'name',
  'createdAt',
  'system',
] satisfies (keyof GameRecordDef)[];

const allGamesPaginationParamsSchema =
  getOptionalPaginationParamsSchema(allGamesSortFields);

export const Route = createFileRoute('/api/games')({
  server: {
    handlers: {
      GET: async () => {
        const searchParams = Route.useSearch();
        // TODO - PASS SEARCH PARAMS IN WITHOUT TS ERROR
        const allGames = await fetchAllGames({ data: {} });

        return Response.json(allGames);
      },
      POST: async ({ request }) => {
        type CreateNewGameDataDef = Parameters<typeof createNewGame>[0]['data'];

        const data: CreateNewGameDataDef = await request.json();

        const createdGameRecord = await createNewGame({ data });

        return Response.json(createdGameRecord);
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

export const createNewGame = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(apiRoutes.games.createSchema)
  .handler(async ({ context, data: gameDetails }) => {
    return gamesDbQueries.createGame({
      ...gameDetails,
      userId: context.user.id,
    });
  });
