import { createFileRoute } from '@tanstack/react-router';

import { getCustomFieldsSetsForCollectionIdServerFn } from '#/api/routes/collection-items/server/serverFns';
import { getLastAddedItemInCollectionIdServerFn } from '#/api/routes/collections/server/serverFns';
import { CollectionPage } from '#/pages/CollectionItemsPage';
import {
  getCollectionById,
  getItemsByCollectionId,
} from '#/routes/api/collections/$id';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionPage,
  loader: async ({ params }) => {
    const collectionId = Number(params.id);
    const [collection, paginatedData, customFields, lastAddedItem] =
      await Promise.all([
        await getCollectionById({ data: { collectionId } }),
        await getItemsByCollectionId({ data: { collectionId } }),
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
});
