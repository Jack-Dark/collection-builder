import type { NewGameRecordDef } from '#/api/routes/games/server/types';

import { createFileRoute } from '@tanstack/react-router';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authMiddleware } from '#/utils/auth-middleware';

export const Route = createFileRoute('/api/games/$id')({
  server: {
    handlers: {
      DELETE: async ({ params }) => {
        const id = Number(params.id);

        await gamesDbQueries.deleteGameById(id);

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
      PUT: async ({ params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: Partial<NewGameRecordDef> = await request.json();

        const updatedGame = await gamesDbQueries.updateGameById(
          id,
          gameDetails,
        );

        return Response.json(updatedGame);
      },
    },
    middleware: [authMiddleware],
  },
});
