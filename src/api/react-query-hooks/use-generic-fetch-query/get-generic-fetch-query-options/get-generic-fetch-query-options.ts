import { queryOptions } from '@tanstack/react-query';

import type { QueryKeyDef } from '../use-generic-fetch-query.types';
import type { GetGenericFetchOptionsProps } from './get-generic-fetch-query-options.types';

export const getGenericFetchQueryOptions = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<any, any>,
  TTransformedData extends TResponseDef,
>(
  props: GetGenericFetchOptionsProps<
    TRequestArgs,
    TResponseDef,
    TTransformedData
  >,
) => {
  const { cacheTime, onStart, queryFn, queryKey, requestArgs, ...configs } =
    props;

  const configuredQueryOptions = queryOptions<
    TResponseDef,
    Error,
    TTransformedData,
    QueryKeyDef
  >({
    ...configs,
    gcTime: cacheTime,
    queryFn: async () => {
      await onStart?.();

      return queryFn({ data: requestArgs });
    },
    queryKey,
  });

  return configuredQueryOptions;
};
