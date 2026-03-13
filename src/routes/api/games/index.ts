import { createFileRoute } from '@tanstack/react-router';
import { createGame } from '#/api/routes/games/games.queries';

export const Route = createFileRoute('/api/games/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Access the request body, for example, a JSON body
        const body: Parameters<typeof createGame>[0] = await request.json();
        console.log('🚀 ~ ROUTE body:', body);

        const updatedGame = createGame(body);

        return new Response(JSON.stringify(updatedGame));
      },
    },
  },
});
