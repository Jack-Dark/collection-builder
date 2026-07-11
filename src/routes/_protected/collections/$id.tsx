import { createFileRoute } from '@tanstack/react-router';

import { getCustomFieldsByCollectionIdServerFn } from '#/api/routes/collection-items/server/serverFns';
import { getLastAddedItemInCollectionIdServerFn } from '#/api/routes/collections/server/serverFns';
import {
  collectionItemsSearchQueriesSchema,
  getCollectionByIdServerFn,
  getItemsByCollectionIdServerFn,
} from '#/api/TEMP';
import { CollectionItemsPage } from '#/pages/CollectionItemsPage';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionItemsPage,
  loader: async ({ deps: collectionItemsSearchQueries, params }) => {
    const collectionId = Number(params.id);

    const [collection, paginatedData, customFields, lastAddedItem] =
      await Promise.all([
        await getCollectionByIdServerFn({ data: { collectionId } }),
        await getItemsByCollectionIdServerFn({
          data: {
            collectionId,
            params: collectionItemsSearchQueries,
          },
        }),
        await getCustomFieldsByCollectionIdServerFn({
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
