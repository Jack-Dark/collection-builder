import { createFileRoute } from '@tanstack/react-router';

import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';
import { collectionItemsSearchQueriesSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import { getCollectionDetailsByIdServerFn } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.serverFn';
import { CollectionItemsPage } from '#/pages/CollectionItemsPage';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionItemsPage,
  loader: async ({ context, deps: searchQueries, params }) => {
    const collectionId = Number(params.id);

    const queryOptions = getGenericFetchQueryOptions({
      groupName: reactQueryKeys.getCollectionDetailsById,
      queryFn: getCollectionDetailsByIdServerFn,
      requestArgs: { collectionId, params: searchQueries },
    });

    return await context.queryClient.ensureQueryData(queryOptions);
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  validateSearch: collectionItemsSearchQueriesSchema,
});
