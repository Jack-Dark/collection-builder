import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { gamesDbQueries } from '#/api/routes/collection-items/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import { CollectionPage } from '#/pages/CollectionPage';
import {
  getCollectionById,
  getItemsByCollectionId,
} from '#/routes/api/collections/$id';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: (props) => {
    return <CollectionPage {...props} />;
  },
  loader: async ({ params }) => {
    const collectionId = Number(params.id);
    const [collection, items, lastAddedSystem] = await Promise.all([
      await getCollectionById({ data: { id: collectionId } }),
      await getItemsByCollectionId({ data: { collectionId } }),
      await fetchLastAddedCollectionItemSystem(),
    ]);

    return {
      collection,
      items,
      lastAddedSystem,
    };
  },
});

const fetchLastAddedCollectionItemSystem = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .handler(async ({ context }) => {
    return gamesDbQueries.getLastAddedCollectionItemSystemQuery(
      context.user.id,
    );
  });
