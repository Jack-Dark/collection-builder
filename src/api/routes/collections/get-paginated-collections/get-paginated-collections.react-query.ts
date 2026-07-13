import { useServerFn } from '@tanstack/react-start';

import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';

import type {
  GetPaginatedCollectionsRequestArgsDef,
  GetPaginatedCollectionsResponseDef,
} from './get-paginated-collections.types';

import { getPaginatedCollectionsServerFn } from './get-paginated-collections.serverFn';

export const useGetPaginatedCollections = <
  TTransformedData extends GetPaginatedCollectionsResponseDef,
>(
  props: GenericFetchProps<
    GetPaginatedCollectionsRequestArgsDef,
    GetPaginatedCollectionsResponseDef,
    TTransformedData
  >,
) => {
  const queryFn = useServerFn(getPaginatedCollectionsServerFn);

  return useGenericFetchQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    groupName: reactQueryKeys.getPaginatedCollections,
    queryFn,
    ...props,
  });
};

export const useInvalidateGetPaginatedCollections =
  getUseInvalidateQuery<GetPaginatedCollectionsRequestArgsDef>(
    reactQueryKeys.getPaginatedCollections,
  );
