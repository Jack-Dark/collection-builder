import type { NewGameRecordDef } from '#/api/routes/games/games.types';

import { createFileRoute } from '@tanstack/react-router';
import {
  deleteGameById,
  getGameById,
  updateGameById,
} from '#/api/routes/games/games.queries';

export const Route = createFileRoute('/api/games/$id/')({
  server: {
    handlers: {
      DELETE: async ({ params }) => {
        const id = Number(params.id);

        await deleteGameById(id);

        return new Response();
      },
      GET: async ({ params }) => {
        const id = Number(params.id);

        const updatedGame = await getGameById(id);

        return new Response(JSON.stringify(updatedGame));
      },
      PUT: async ({ params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: Partial<NewGameRecordDef> = await request.json();

        const updatedGame = await updateGameById(id, gameDetails);

        return new Response(JSON.stringify(updatedGame));
      },
    },
  },
});
