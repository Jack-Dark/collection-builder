import { useServerFn } from '@tanstack/react-start';

import type {
  PaginatedResponseData,
  PaginationQueriesSchemaDef,
} from '#/api/pagination/pagination.types';
import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getGenericQueryObj } from '#/api/react-query-hooks/use-generic-fetch-query/helpers/get-generic-query-obj';
import { useGetInvalidateQueryCache } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/use-get-invalidate-query-cache';

import type { CollectionRecordDef } from '../collection.types';

import { getPaginatedCollectionsServerFn } from './get-paginated-collections.serverFn';

type GetPaginatedCollectionsResponseDef = PaginatedResponseData<
  'collections',
  CollectionRecordDef
>;

export const useGetPaginatedCollections = <
  TTransformedData extends GetPaginatedCollectionsResponseDef,
>(
  props?: GenericFetchProps<
    PaginationQueriesSchemaDef,
    GetPaginatedCollectionsResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(getPaginatedCollectionsServerFn);

  const queryObj = getGenericQueryObj<
    PaginationQueriesSchemaDef,
    GetPaginatedCollectionsResponseDef
  >({
    groupName: 'YOUR_UNIQUE_REQUEST_NAME',
    query: (data) => {
      return serverFn({ data });
    },
  });

  return useGenericFetchQuery<
    PaginationQueriesSchemaDef,
    GetPaginatedCollectionsResponseDef,
    TTransformedData
  >({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    queryObj,
    ...props,
  });
};

export const useInvalidateGetPaginatedCollectionsCache = () => {
  const serverFn = useServerFn(getPaginatedCollectionsServerFn);

  const queryObj = getGenericQueryObj<
    PaginationQueriesSchemaDef,
    GetPaginatedCollectionsResponseDef
  >({
    groupName: 'YOUR_UNIQUE_REQUEST_NAME',
    query: (data) => {
      return serverFn({ data });
    },
  });
  const invalidateGetPaginatedCollectionsCache =
    useGetInvalidateQueryCache(queryObj);

  return { invalidateGetPaginatedCollectionsCache };
};
