import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/games/server';
import { Collection } from '#/pages/Collection';

export const Route = createFileRoute('/_app/collection')({
  component: Collection,
  loader: async () => {
    return fetchAllGames();
  },
});

const fetchAllGames = createServerFn({
  method: 'GET',
}).handler(async () => {
  const [games, lastAddedGame] = await Promise.all([
    gamesDbQueries.getAllGames(),
    gamesDbQueries.getLastAddedGame(),
  ]);

  return { games, lastAddedSystem: lastAddedGame?.system };
});
