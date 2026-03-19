import type { UpdateGameRecordDef } from '#/api/routes/games/server/types';

import { createFileRoute } from '@tanstack/react-router';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/games/$id')({
  server: {
    handlers: {
      DELETE: async ({ context, params }) => {
        const id = Number(params.id);

        await gamesDbQueries.softDeleteGameById({
          id,
          userId: context.user.id,
        });

        return Response.json({ message: 'Game deleted successfully' });
      },
      GET: async ({ context, params }) => {
        const id = Number(params.id);

        const updatedGame = await gamesDbQueries.getGameById({
          id,
          userId: context.user.id,
        });

        return Response.json(updatedGame);
      },
      PUT: async ({ context, params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: UpdateGameRecordDef = await request.json();

        const updatedGame = await gamesDbQueries.updateGameById({
          game: { ...gameDetails, id },
          userId: context.user.id,
        });

        return Response.json(updatedGame);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});
