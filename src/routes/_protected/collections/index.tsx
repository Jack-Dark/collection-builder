import { createFileRoute } from '@tanstack/react-router';

import { optionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';
import { getPaginatedCollectionsServerFn } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.serverFn';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  loader: async ({ deps: searchQueries }) => {
    return getPaginatedCollectionsServerFn({
      data: {
        params: searchQueries,
      },
    });
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  validateSearch: optionalPaginationQueriesSchema,
});
