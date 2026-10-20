import { createFileRoute } from '@tanstack/react-router';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { collectionsListSearchQueriesSchema } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.schema';
import { getPaginatedCollectionsServerFn } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.serverFn';
import { CollectionsListPage } from '#/pages/CollectionsListPage';
import { createMetaTags } from '#/routes/__root';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  validateSearch: collectionsListSearchQueriesSchema,
  loaderDeps: ({ search }) => {
    return search;
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

    return await context.queryClient.query(queryOptions);
  },
  head: ({ loaderData }) => {
    const title = 'Collections: Collection Tracker';

    const maxItems = 3;
    const numRecords = loaderData?.collections?.length || 0;
    const numRecordsToList = Math.min(maxItems, numRecords);
    const hasMoreRecords = numRecords > maxItems;

    const description = loaderData?.collections
      ?.slice(0, numRecordsToList)
      ?.reduce((acc, item, index) => {
        const isLastIndex =
          index === Math.min(maxItems, loaderData.collections.length) - 1;

        if (isLastIndex) {
          if (hasMoreRecords) {
            return `${acc}${item.name}, etc...`;
          } else {
            return `${acc}${item.name}`;
          }
        } else {
          return `${acc}${item.name}, `;
        }
      }, '');

    return {
      meta: createMetaTags({
        title,
        description,
      }),
    };
  },
});
