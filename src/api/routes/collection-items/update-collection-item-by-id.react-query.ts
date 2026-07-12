import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { updateCollectionItemServerFn } from './update-collection-item-by-id/update-collection-item-by-id.serverFn';

export const useUpdateCollectionItemById = (
  props?: Omit<Parameters<typeof useMutation>[0], 'mutationFn'>,
) => {
  const mutationFn = useServerFn(updateCollectionItemServerFn);

  const { mutate: onUpdateCollectionItem, ...rest } = useMutation({
    mutationFn,
    ...props,
    onError: (error, variables, context) => {
      // 1. The error object thrown by mutationFn
      console.error(`Mutation failed: ${error}`);

      // 2. The exact variables sent into mutate()
      console.log(`Attempted variables:`, variables);

      // 3. Rollback context if using optimistic updates
      if (context) {
        // Do rollback logic here
      }
    },
    onSuccess: async (data, ...rest) => {
      props?.onSuccess?.(data, ...rest);
    },
  });

  return { onUpdateCollectionItem, ...rest };
};
