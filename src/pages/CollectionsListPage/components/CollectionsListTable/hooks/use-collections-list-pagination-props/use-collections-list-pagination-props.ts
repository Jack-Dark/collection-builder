import type { PaginationMetadata } from '#/api/pagination/pagination.types';

import { useOnUpdateCollectionsListQueries } from '#/pages/CollectionsListPage/hooks/use-on-update-collection-items-queries';
import { Route as CollectionRoute } from '#/routes/_protected/collections';

export const useCollectionsListPaginationProps = (props: {
  pagination: PaginationMetadata;
}) => {
  const { pagination } = props;

  const search = CollectionRoute.useSearch();

  const { onUpdateCollectionsListQueries } =
    useOnUpdateCollectionsListQueries();

  const paginationProps = {
    limit: {
      onChange: (limit: number) => {
        onUpdateCollectionsListQueries({ limit });
      },
      value: search.limit || 100,
    },
    page: {
      max: pagination.totalPages,
      onChange: (page: number) => {
        onUpdateCollectionsListQueries({ page });
      },
      value: search.page || 1,
    },
  };

  return paginationProps;
};
