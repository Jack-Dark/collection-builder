import { useQueryClient } from '@tanstack/react-query';

import type { ReactQueryKeysDef } from '../../use-generic-fetch-query.types';

export const getUseInvalidateQuery = <TRequestArgs extends Record<string, any>>(
  groupName: ReactQueryKeysDef,
) => {
  return () => {
    const queryClient = useQueryClient();

    const invalidate = async (props?: {
      id?: number | string | undefined;
      requestArgs?: TRequestArgs;
    }) => {
      const queryKey = [groupName, props?.id, props?.requestArgs].filter(
        Boolean,
      );

      await queryClient.invalidateQueries({
        queryKey,
      });
    };

    return invalidate;
  };
};
