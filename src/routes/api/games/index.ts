import { createFileRoute } from '@tanstack/react-router';
import { gamesDbQueries } from '#/api/routes/games/server';

export const Route = createFileRoute('/api/games/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Access the request body, for example, a JSON body
        const body: Parameters<typeof gamesDbQueries.createGame>[0] =
          await request.json();
        console.log('🚀 ~ ROUTE body:', body);

        const updatedGame = gamesDbQueries.createGame(body);

        return new Response(JSON.stringify(updatedGame));
      },
    },
  },
});
