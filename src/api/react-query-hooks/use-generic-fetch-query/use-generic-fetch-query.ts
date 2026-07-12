import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications';

import type {
  QueryKeyDef,
  UseGenericFetchProps,
} from './use-generic-fetch-query.types';

/**
 * @example
 * const YOUR_FETCH_QUERY_OBJ = getGenericQueryObj({
 *   groupName: 'YOUR_UNIQUE_REQUEST_NAME',
 *   query,
 * });
 *
 * export const use[YOUR_FETCH_QUERY_NAME] = <
 *   TTransformedData = YOUR_FETCH_RESPONSE_TYPE,
 * >(
 *   props?: GenericFetchProps<
 *     YOUR_FETCH_ARGS_TYPE,
 *     YOUR_FETCH_RESPONSE_TYPE,
 *     TTransformedData
 *   >,
 * ) =>
 *   useGenericFetchQuery({
 *     fallbackErrorMessage: 'Unable to fetch ___________.',
 *     queryObj: YOUR_FETCH_QUERY_OBJ,
 *     ...props,
 *   });
 *
 * export const useInvalidate[YOUR_FETCH_QUERY_NAME]Cache = () => {
 *   const invalidate[YOUR_FETCH_QUERY_NAME]Cache = useGetInvalidateQueryCache(
 *     YOUR_FETCH_QUERY_OBJ,
 *   );
 *
 *   return { invalidate[YOUR_FETCH_QUERY_NAME]Cache };
 * };
 */
export const useGenericFetchQuery = <
  TRequestArgs extends Record<string, any> | never,
  TResponseDef extends Record<any, any>,
  TTransformedData extends TResponseDef,
>(
  props: UseGenericFetchProps<TRequestArgs, TResponseDef, TTransformedData>,
) => {
  const {
    cacheTime,
    fallbackErrorMessage,
    onError,
    onStart,
    onSuccess,
    queryObj,
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

  const queryConfig: UseQueryOptions<
    TResponseDef,
    Error,
    TTransformedData,
    QueryKeyDef
  > = {
    ...configs,
    gcTime: cacheTime,
    queryFn: async () => {
      await onStart?.();

      return queryObj.query(requestArgs);
    },
    queryKey: queryObj.key(requestArgs),
    select: memoizedSelect,
  };

  const context = useQuery(queryConfig);

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
    // ? Providing context.data ensures that onSuccess is executed any time
    // ? the data changes, even if provided from a cached response
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
