import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/games/server';
import { Collection } from '#/pages/Collection';
import { authMiddleware } from '#/utils/auth-middleware';

export const Route = createFileRoute('/_app/collection')({
  component: Collection,
  loader: async () => {
    return fetchAllGames();
  },
});

const fetchAllGames = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user.id) {
      throw redirect({ to: '/sign-up' });
    }

    const [games, lastAddedGame] = await Promise.all([
      gamesDbQueries.getAllGames(context.user.id),
      gamesDbQueries.getLastAddedGame(context.user.id),
    ]);

    return { games, lastAddedSystem: lastAddedGame?.system };
  });
