import type { QueryOptions } from '@tanstack/react-query';

import type { QueryKeyDef } from '../use-generic-fetch-query.types';

export type GetGenericFetchOptionsProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any>,
  TTransformedData = TResponseDef,
> = Partial<
  Omit<
    QueryOptions<
      TTransformedData,
      Error,
      TTransformedData,
      QueryKeyDef<TRequestArgs>
    >,
    'gcTime' | 'queryFn' | 'queryKey'
  >
> & {
  cacheTime?: number;
  groupName: string;
  onError?: (error: string, requestArgs?: TRequestArgs) => void;
  /** NOT called when returning a cached response. */
  onStart?: () => void | Promise<void>;
  /** This is called on the response every time, even if it's returned from cache. */
  onSuccess?: (data: TTransformedData) => void;
  queryFn: (props: { data: TRequestArgs }) => Promise<TResponseDef>;
  requestArgs: TRequestArgs;
  transform?: (response: TResponseDef) => TTransformedData;
};
