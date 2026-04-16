import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import { CollectionPage } from '#/pages/CollectionPage';

import { fetchAllGames } from '../api/games/route';

export const Route = createFileRoute('/_protected/collection')({
  component: CollectionPage,
  loader: async () => {
    const [games, lastAddedSystem] = await Promise.all([
      await fetchAllGames(),
      await fetchLastAddedGameSystem(),
    ]);

    return {
      games,
      lastAddedSystem,
    };
  },
});

const fetchLastAddedGameSystem = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .handler(async ({ context }) => {
    return gamesDbQueries.getLastAddedGamesSystem(context.user.id);
  });
