import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCollectionsWithCustomFieldsRequestArgsDef,
  GetCollectionsWithCustomFieldsResponseDef,
} from './get-collections-with-custom-field.types';

import { getCollectionsWithCustomFieldsServerFn } from './get-collections-with-custom-field.serverFn';

export const useGetCollectionsWithCustomFields = <
  TTransformedData = GetCollectionsWithCustomFieldsResponseDef,
>(
  props: GenericFetchProps<
    GetCollectionsWithCustomFieldsRequestArgsDef,
    GetCollectionsWithCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  return useGenericFetchQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    queryFn: getCollectionsWithCustomFieldsServerFn,
    queryKey: [
      reactQueryKeys.getCollectionsWithCustomFields,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
    onSuccess: async (data, requestArgs) => {
      await props?.onSuccess?.(data, requestArgs);
    },
  });
};

export const useInvalidateGetCollectionsWithCustomFields =
  getUseInvalidateQuery<GetCollectionsWithCustomFieldsRequestArgsDef>(
    reactQueryKeys.getCollectionsWithCustomFields,
  );
