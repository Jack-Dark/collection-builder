import { useServerFn } from '@tanstack/react-start';

import type { PaginationQueriesSchemaDef } from '#/api/pagination/pagination.types';
import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/use-get-invalidate-query-cache';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';

import type { GetPaginatedCollectionsResponseDef } from './get-paginated-collections.types';

import { getPaginatedCollectionsServerFn } from './get-paginated-collections.serverFn';

export const useGetPaginatedCollections = <
  TTransformedData extends GetPaginatedCollectionsResponseDef,
>(
  props?: GenericFetchProps<
    PaginationQueriesSchemaDef,
    GetPaginatedCollectionsResponseDef,
    TTransformedData
  >,
) => {
  const query = useServerFn(getPaginatedCollectionsServerFn);

  return useGenericFetchQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    groupName: reactQueryKeys.getPaginatedCollections,
    query,
    ...props,
  });
};

export const useInvalidateGetPaginatedCollections =
  getUseInvalidateQuery<PaginationQueriesSchemaDef>(
    reactQueryKeys.getPaginatedCollections,
  );
