import { useQueryClient } from '@tanstack/react-query';

import type { ReactQueryKeysDef } from '../../use-generic-fetch-query.types';

export const getUseInvalidateQuery = <
  TRequestArgs extends Record<string, any> | never,
>(
  groupName: ReactQueryKeysDef,
) => {
  return () => {
    const queryClient = useQueryClient();

    const invalidate = async (requestArgs?: TRequestArgs) => {
      await queryClient.invalidateQueries({
        queryKey: [groupName, requestArgs],
      });
    };

    return invalidate;
  };
};
