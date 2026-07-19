import type { PaginationMetadata } from '#/api/pagination/pagination.types';

import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../components/CollectionItemsFiltersContent';

export const useCollectionDetailsPaginationProps = (props: {
  pagination: PaginationMetadata;
}) => {
  const { pagination } = props;

  const search = CollectionRoute.useSearch();

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  const paginationProps = {
    limit: {
      onChange: (limit: number) => {
        onUpdateCollectionItemsQueries({ limit });
      },
      value: search.limit || 100,
    },
    page: {
      max: pagination.totalPages,
      onChange: (page: number) => {
        onUpdateCollectionItemsQueries({ page });
      },
      value: search.page || 1,
    },
  };

  return paginationProps;
};
