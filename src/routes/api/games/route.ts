import { createFileRoute } from '@tanstack/react-router';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authMiddleware } from '#/utils/auth-middleware';

export const Route = createFileRoute('/api/games')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const gameDetails: Parameters<typeof gamesDbQueries.createGame>[0] =
          await request.json();

        const createdGameRecord = await gamesDbQueries.createGame(gameDetails);

        return Response.json(createdGameRecord);
      },
    },
    middleware: [authMiddleware],
  },
});
