import type { UseQueryOptions } from '@tanstack/react-query';
import type { DependencyList } from 'react';

import type { reactQueryKeys } from './react-query-keys';

// ? This type def applies the props passed to the hook when calling it
export type GenericFetchProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any>,
  TTransformedData = TResponseDef,
> = Partial<
  Omit<
    UseQueryOptions<
      TTransformedData,
      Error,
      TTransformedData,
      QueryKeyDef<TRequestArgs>
    >,
    'gcTime' | 'queryFn' | 'queryKey' | 'select'
  >
> & {
  cacheTime?: number;
  onError?: (error: string, requestArgs?: TRequestArgs) => void;
  /** NOT called when returning a cached response. */
  onStart?: () => void | Promise<void>;
  /** This is called on the response every time, even if it's returned from cache. */
  onSuccess?: (data: TTransformedData) => void;
  requestArgs: TRequestArgs;
  showLoading?: boolean;
  transform?: (response: TResponseDef) => TTransformedData;
  transformDependencies?: DependencyList;
};

// ? This type def applies specifically to the hook's props
export type UseGenericFetchProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any>,
  TTransformedData = TResponseDef,
> = GenericFetchProps<TRequestArgs, TResponseDef, TTransformedData> & {
  fallbackErrorMessage: string;
  queryFn: (props: { data: TRequestArgs }) => Promise<TResponseDef>;
  queryKey: QueryKeyDef<TRequestArgs>;
};

type RequestId = number | string | undefined;

export type QueryKeyDef<TRequestArgs extends Record<string, any>> = Readonly<
  | [ReactQueryKeysDef]
  | [ReactQueryKeysDef, TRequestArgs]
  | [ReactQueryKeysDef, RequestId, TRequestArgs]
>;

export type ReactQueryKeysDef =
  (typeof reactQueryKeys)[keyof typeof reactQueryKeys];
