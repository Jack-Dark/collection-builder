import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/games/server';
import { Collection } from '#/pages/collection';

export const Route = createFileRoute('/collection/')({
  component: Collection,
  loader: async () => {
    return fetchAllGames();
  },
});

const fetchAllGames = createServerFn({
  method: 'GET',
}).handler(() => {
  return gamesDbQueries.getAllGames();
});
