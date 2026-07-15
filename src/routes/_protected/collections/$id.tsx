import { createFileRoute } from '@tanstack/react-router';

import type { GetCollectionDetailsByIdResponseDef } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.types';

import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';
import { collectionItemsSearchQueriesSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import { getCollectionDetailsByIdServerFn } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.serverFn';
import { CollectionItemsPage } from '#/pages/CollectionItemsPage';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionItemsPage,
  head: ({ loaderData }) => {
    const data = loaderData as unknown as GetCollectionDetailsByIdResponseDef;

    const title = data?.collection
      ? `Collection: ${data?.collection?.name} (${data?.pagination?.totalRecords})`
      : undefined;
    const content = data?.items
      ?.slice(0, 3)
      ?.map((item) => {
        return item?.name;
      })
      .join(', ');

    return {
      meta: [{ title }, { content, name: 'description' }],
    };
  },
  loader: async ({ context, deps: searchQueries, params }) => {
    const collectionId = Number(params.id);

    const requestArgs = { collectionId, params: searchQueries };

    const queryOptions = getGenericFetchQueryOptions({
      queryFn: getCollectionDetailsByIdServerFn,
      queryKey: [
        reactQueryKeys.getCollectionDetailsById,
        requestArgs.collectionId,
        requestArgs,
      ],
      requestArgs,
    });

    return await context.queryClient.ensureQueryData(queryOptions);
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  ssr: false,
  validateSearch: collectionItemsSearchQueriesSchema,
});
