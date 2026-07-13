import { createFileRoute } from '@tanstack/react-router';

import { collectionItemsSearchQueriesSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import { getCollectionDetailsByIdServerFn } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.serverFn';
import { CollectionItemsPage } from '#/pages/CollectionItemsPage';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionItemsPage,
  loader: async ({ deps: searchQueries, params }) => {
    const collectionId = Number(params.id);

    const data = await getCollectionDetailsByIdServerFn({
      data: {
        collectionId,
        params: searchQueries,
      },
    });

    return {
      collectionId,
      ...data,
    };
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  validateSearch: collectionItemsSearchQueriesSchema,
});
