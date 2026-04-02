import { createFileRoute } from '@tanstack/react-router';
import { gamesDbQueries } from '#/api/routes/games/server';
import { getMockGamesForUser } from '#/api/routes/games/server/MOCK_DATA';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/games/mock-data/$userId')({
  server: {
    handlers: {
      DELETE: async ({ params }) => {
        const { userId } = params;

        await gamesDbQueries.hardDeleteAllGamesByUser(userId);

        return Response.json({});
      },
      POST: async ({ params }) => {
        const { userId } = params;

        const mockGames = getMockGamesForUser(userId);
        await gamesDbQueries.createMockGames(mockGames);

        return Response.json({});
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});
