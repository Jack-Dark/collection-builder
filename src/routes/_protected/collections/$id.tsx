import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import { CollectionPage } from '#/pages/CollectionItemsPage';
import {
  fetchCollectionById,
  fetchItemsByCollectionId,
} from '#/routes/api/collections/$id/route';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionPage,
  loader: async ({ params }) => {
    const collectionId = Number(params.id);
    const [collection, items, lastAddedSystem] = await Promise.all([
      await fetchCollectionById({ data: { id: collectionId } }),
      await fetchItemsByCollectionId({ data: { collectionId } }),
      await fetchLastAddedGameSystem(),
    ]);

    return {
      collection,
      items,
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
