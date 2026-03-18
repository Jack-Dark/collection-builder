import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authRedirectMiddleware } from '#/auth';
import { CollectionPage } from '#/pages/CollectionPage';

export const Route = createFileRoute('/_app/collection')({
  component: CollectionPage,
  loader: async () => {
    return fetchAllGames();
  },
});

const fetchAllGames = createServerFn({
  method: 'GET',
})
  .middleware([authRedirectMiddleware])
  .handler(async ({ context }) => {
    const [games, lastAddedSystem] = await Promise.all([
      gamesDbQueries.getAllGames(context.user.id),
      gamesDbQueries.getLastAddedGamesSystem(context.user.id),
    ]);

    return { games, lastAddedSystem };
  });
