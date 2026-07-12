import { queryOptions, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications';

import type {
  QueryKeyDef,
  UseGenericFetchProps,
} from './use-generic-fetch-query.types';

/**
 * @example
 * export const use[YOUR_FETCH_QUERY_NAME] = <
 *   TTransformedData = YOUR_FETCH_RESPONSE_TYPE,
 * >(
 *   props?: GenericFetchProps<
 *     YOUR_FETCH_ARGS_TYPE,
 *     YOUR_FETCH_RESPONSE_TYPE,
 *     TTransformedData
 *   >,
 * ) => {
 *  const query = useServerFn(YOUR_SERVER_FUNCTION);
 *
 *  return useGenericFetchQuery({
 *    fallbackErrorMessage: 'Unable to retrieve __________.',
 *    groupName: YOUR_UNIQUE_GROUP_NAME,
 *    query,
 *    ...props,
 *  });
 * }
 *
 * export const useInvalidate[YOUR_FETCH_QUERY_NAME] =
 *   getUseInvalidateQuery<YOUR_FETCH_ARGS_TYPE>(
 *     YOUR_UNIQUE_GROUP_NAME
 *   );
 */
export const useGenericFetchQuery = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<any, any>,
  TTransformedData extends TResponseDef,
>(
  props: UseGenericFetchProps<TRequestArgs, TResponseDef, TTransformedData>,
) => {
  const {
    cacheTime,
    fallbackErrorMessage,
    groupName,
    onError,
    onStart,
    onSuccess,
    query,
    requestArgs,
    showLoading: enableSpinner,
    transform,
    transformDependencies = [],
    ...configs
  } = props;

  const { hideSpinner, showSpinner } = useSpinner();
  const { notifyError } = useNotifications();

  const memoizedTransformDependencies = useMemo(() => {
    return transformDependencies;
  }, transformDependencies);

  const memoizedSelect = useCallback((response: TResponseDef) => {
    if (transform) {
      return transform?.(response);
    }

    return response;
  }, memoizedTransformDependencies);

  const queryConfig = queryOptions<
    TResponseDef,
    Error,
    TTransformedData,
    QueryKeyDef<TRequestArgs>
  >({
    ...configs,
    gcTime: cacheTime,
    queryFn: async () => {
      await onStart?.();

      return query({ data: requestArgs });
    },
    queryKey: [groupName, requestArgs],
    select: memoizedSelect,
  });

  const context = useQuery(queryConfig);
  // const context = useSuspenseQuery(queryConfig);

  const { data, error, isError, isFetching, isSuccess } = context;

  useEffect(() => {
    if (enableSpinner) {
      if (isFetching) {
        showSpinner();
      } else {
        hideSpinner();
      }
    }
  }, [isFetching]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.(data);
    }
  }, [
    isSuccess,
    // ? Providing context.data ensures that onSuccess is executed any time the data changes, even if provided from a cached response
    data,
  ]);

  useEffect(() => {
    if (isError) {
      const errorMsg = error?.message || fallbackErrorMessage;

      notifyError(errorMsg);

      onError?.(errorMsg, requestArgs);
    }
  }, [isError]);

  return context;
};
