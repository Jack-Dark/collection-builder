import { createFileRoute } from '@tanstack/react-router';

import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { reactQueryKeys } from '#/api/react-query-hooks/react-query-keys';
import { collectionsListSearchQueriesSchema } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.schema';
import { getPaginatedCollectionsServerFn } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.serverFn';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  loader: async ({ context, deps: searchQueries }) => {
    const requestArgs = { params: searchQueries };

    const queryOptions = getGenericFetchQueryOptions({
      queryFn: getPaginatedCollectionsServerFn,
      queryKey: [
        reactQueryKeys.getPaginatedCollections,
        JSON.stringify(requestArgs),
      ],
      requestArgs,
    });

    return await context.queryClient.ensureQueryData(queryOptions);
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  validateSearch: collectionsListSearchQueriesSchema,
});
