import { useQueryClient } from '@tanstack/react-query';

import type { QueryObjectKeyDef } from '../../use-generic-fetch-query.types';

export const useGetInvalidateQueryCache = <
  TRequestArgs extends Record<string, any>,
>(props: {
  groupKey: () => string;
  key: QueryObjectKeyDef<TRequestArgs>;
}) => {
  const queryClient = useQueryClient();

  const invalidate = async (predicate: (query: any) => boolean) => {
    await queryClient.invalidateQueries({
      predicate: (query) => {
        return predicate(query);
      },
    });
  };

  const invalidateCache = async (argsToInvalidate?: TRequestArgs) => {
    await invalidate((query) => {
      if (typeof query.queryKey[0] === 'string') return false;

      const { groupKey, key } = query.queryKey[0] as {
        groupKey: string;
        key: string;
      };

      return argsToInvalidate
        ? key === props.key(argsToInvalidate)[0].key
        : groupKey === props.groupKey();
    });
  };

  return invalidateCache;
};
