import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';

import type {
  GetCollectionDetailsByIdRequestArgsDef,
  GetCollectionDetailsByIdResponseDef,
} from './get-collection-details-by-id.types';

import { getCollectionDetailsByIdServerFn } from './get-collection-details-by-id.serverFn';

export const useGetCollectionDetailsById = <
  TTransformedData extends GetCollectionDetailsByIdResponseDef,
>(
  props: GenericFetchProps<
    GetCollectionDetailsByIdRequestArgsDef,
    GetCollectionDetailsByIdResponseDef,
    TTransformedData
  >,
) => {
  return useGenericFetchQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    queryFn: getCollectionDetailsByIdServerFn,
    queryKey: [
      reactQueryKeys.getCollectionDetailsById,
      props.requestArgs.collectionId,
      props.requestArgs,
    ],
    ...props,
  });
};

export const useInvalidateGetCollectionDetailsById =
  getUseInvalidateQuery<GetCollectionDetailsByIdRequestArgsDef>(
    reactQueryKeys.getCollectionDetailsById,
  );
