import { createFileRoute } from '@tanstack/react-router';

import { optionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';
import { getPaginatedCollectionsServerFn } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.serverFn';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  loader: async ({ context, deps: searchQueries }) => {
    const queryOptions = getGenericFetchQueryOptions({
      groupName: reactQueryKeys.getPaginatedCollections,
      queryFn: getPaginatedCollectionsServerFn,
      requestArgs: { params: searchQueries },
    });

    return await context.queryClient.ensureQueryData(queryOptions);
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  validateSearch: optionalPaginationQueriesSchema,
});
