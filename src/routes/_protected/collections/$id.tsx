import { createFileRoute } from '@tanstack/react-router';

import { getCustomFieldsSetsForCollectionIdServerFn } from '#/api/routes/collection-items/server/serverFns';
import { getLastAddedItemInCollectionIdServerFn } from '#/api/routes/collections/server/serverFns';
import { CollectionItemsPage } from '#/pages/CollectionItemsPage';
import {
  collectionItemsSearchQueriesSchema,
  getCollectionById,
  getItemsByCollectionId,
} from '#/routes/api/collections/$id';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionItemsPage,
  loader: async ({ deps: collectionItemsSearchQueries, params }) => {
    const collectionId = Number(params.id);

    const [collection, paginatedData, customFields, lastAddedItem] =
      await Promise.all([
        await getCollectionById({ data: { collectionId } }),
        await getItemsByCollectionId({
          data: {
            collectionId,
            params: collectionItemsSearchQueries,
          },
        }),
        await getCustomFieldsSetsForCollectionIdServerFn({
          data: { collectionId },
        }),
        await getLastAddedItemInCollectionIdServerFn({
          data: { collectionId },
        }),
      ]);

    return {
      collection,
      collectionId,
      customFields,
      items: paginatedData.data,
      lastAddedItem,
      pagination: paginatedData.metadata,
    };
  },
  loaderDeps: ({ search }) => {
    return {
      filters: search.filters,
      limit: search.limit,
      page: search.page,
      search: search.search,
      sort: search.sort,
    };
  },
  validateSearch: collectionItemsSearchQueriesSchema,
});
