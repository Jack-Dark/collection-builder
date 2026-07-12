import type { UseMutationOptions } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications';

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
    showSpinner: enableSpinner,
    transform,
    ...configs
  } = props;

  const { hideSpinner, showSpinner } = useSpinner();
  const { notify } = useNotifications();

  const handleMutationFn = async (requestArgs: TRequestArgs) => {
    const response = await mutationFn(requestArgs);

    const notice: string = response?.notice;

    if (notice) {
      notify(notice);
    }

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
      onError?.(error?.message || fallbackErrorMessage, requestArgs);
    },
    ...configs,
  });

  const { isPending } = context;

  useEffect(() => {
    if (enableSpinner) {
      if (isPending) {
        showSpinner();
      } else {
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

// ? This type def applies the props passed to the hook when calling it
export interface GenericMutateQueryProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any> | void,
  TTransformedData = TResponseDef,
> extends Partial<
  Omit<
    UseMutationOptions<TTransformedData, unknown, TRequestArgs, unknown>,
    'onError' | 'mutationFn'
  >
> {
  onError?: (error: string, requestArgs?: TRequestArgs) => void;
  onSuccess?: (
    data: TTransformedData,
    requestArgs: TRequestArgs,
  ) => Promise<void> | void;
  showSpinner?: boolean;
  transform?: (response: TResponseDef) => TTransformedData;
}

// ? This type def applies specifically to the hook's props
export interface UseGenericMutateQueryProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any> | void,
  TTransformedData = TResponseDef,
> extends GenericMutateQueryProps<
  TRequestArgs,
  TResponseDef,
  TTransformedData
> {
  fallbackErrorMessage: string;
  mutationFn: (args: TRequestArgs) => Promise<TResponseDef>;
}

export type ErrorType =
  | string
  | Error
  | Record<'message', string>
  | {
      response: Response;
    };
