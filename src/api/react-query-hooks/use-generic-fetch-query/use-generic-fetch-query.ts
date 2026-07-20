import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications';

import type { UseGenericFetchProps } from './use-generic-fetch-query.types';

import { getGenericFetchQueryOptions } from './get-generic-fetch-query-options';

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
 *  return useGenericFetchQuery({
 *    fallbackErrorMessage: 'Unable to retrieve __________.',
 *    queryKey: [YOUR_UNIQUE_GROUP_NAME, props.requestArgs],
 *    query: YOUR_SERVER_FUNCTION,
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
    fallbackErrorMessage,
    onError,
    onSuccess,
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

  const configuredQueryOptions = getGenericFetchQueryOptions({
    ...configs,
    requestArgs,
    transform: memoizedSelect,
  });

  const context = useSuspenseQuery(configuredQueryOptions);

  const { data, error, isError, isFetching, isPending, isSuccess } = context;

  useEffect(() => {
    if (enableSpinner) {
      if (isFetching || isPending) {
        showSpinner();
      } else {
        hideSpinner();
      }
    }
  }, [isFetching, isPending]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.(data, requestArgs);
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
