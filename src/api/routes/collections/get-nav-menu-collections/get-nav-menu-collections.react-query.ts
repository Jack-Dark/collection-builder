import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';

import type {
  GetNavMenuCollectionsRequestArgsDef,
  GetNavMenuCollectionsResponseDef,
} from './get-nav-menu-collections.types';

import { getNavMenuCollectionsServerFn } from './get-nav-menu-collections.serverFn';

export const useGetNavMenuCollections = <
  TTransformedData extends GetNavMenuCollectionsResponseDef,
>(
  props: GenericFetchProps<
    GetNavMenuCollectionsRequestArgsDef,
    GetNavMenuCollectionsResponseDef,
    TTransformedData
  >,
) => {
  return useGenericFetchQuery({
    fallbackErrorMessage: 'Unable to retrieve collections for nav menu.',
    queryFn: getNavMenuCollectionsServerFn,
    queryKey: [reactQueryKeys.getNavMenuCollections],
    ...props,
  });
};

export const useInvalidateGetNavMenuCollections =
  getUseInvalidateQuery<GetNavMenuCollectionsRequestArgsDef>(
    reactQueryKeys.getNavMenuCollections,
  );
