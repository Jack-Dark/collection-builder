import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications';

import type { UseGenericMutateQueryProps } from './use-generic-mutate-query.types';

/**
 * @example
 * export const useYourMutateQuery = <
 *   TTransformedData = YOUR_RESPONSE_TYPE,
 * >(
 *   props?: GenericMutateQueryProps<
 *     YOUR_REQUEST_ARGS_TYPE,
 *     YOUR_RESPONSE_TYPE,
 *     TTransformedData
 *   >,
 * ) => {
 *  const serverFn = useServerFn(YOUR_SERVER_FUNCTION);
 *
 * const { onMutate: YOUR_RETURNED_FUNCTION_NAME, ...rest } = useGenericMutateQuery({
 *     fallbackErrorMessage: 'Unable to ___________.',
 *     mutationFn: (data) => {
 *       return serverFn({ data });
 *     },
 *     ...props,
 * });
 *
 * return { ...rest, YOUR_RETURNED_FUNCTION_NAME };
 * };
 */
export const useGenericMutateQuery = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any> | void,
  TTransformedData = TResponseDef,
>(
  props: UseGenericMutateQueryProps<
    TRequestArgs,
    TResponseDef,
    TTransformedData
  >,
) => {
  const {
    fallbackErrorMessage,
    mutationFn,
    onError,
    showLoading,
    transform,
    ...configs
  } = props;

  const { hideSpinner, isSpinnerShowing, showSpinner } = useSpinner();
  const { notifyError } = useNotifications();

  const handleMutationFn = async (requestArgs: TRequestArgs) => {
    const response = await mutationFn(requestArgs);

    return transform
      ? transform(response)
      : (response as unknown as TTransformedData);
  };

  const { mutateAsync, ...context } = useMutation<
    TTransformedData,
    /* error type def */
    unknown,
    TRequestArgs
  >({
    mutationFn: handleMutationFn,
    onError: (err: unknown, requestArgs) => {
      const error = err as Error;
      const errorMsg = error?.message || fallbackErrorMessage;

      notifyError(errorMsg);

      onError?.(errorMsg, requestArgs);
    },
    ...configs,
  });

  const { isPending } = context;

  useEffect(() => {
    if (showLoading) {
      if (isPending) {
        showSpinner();
      } else if (isSpinnerShowing) {
        hideSpinner();
      }
    }
  }, [isPending]);

  return {
    ...context,
    onMutate: mutateAsync,
    /** Returns the same value as `isPending`. */
    processing: isPending,
  };
};
