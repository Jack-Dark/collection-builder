import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import {
  createCollectionItemServerFn,
  deleteCollectionItemServerFn,
  updateCollectionItemServerFn,
} from '../server/serverFns';

export const useCreateCollectionItem = (
  props?: Omit<Parameters<typeof useMutation>[0], 'mutationFn'>,
) => {
  const mutationFn = useServerFn(createCollectionItemServerFn);

  const { mutate: onCreateCollectionItem, ...rest } = useMutation({
    mutationFn,
    ...props,
    onSuccess: async (data, ...rest) => {
      props?.onSuccess?.(data, ...rest);
    },
  });

  return { onCreateCollectionItem, ...rest };
};

export const useUpdateCollectionItem = (
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

export const useDeleteCollectionItem = () => {
  const mutationFn = useServerFn(deleteCollectionItemServerFn);

  const { mutate: onDeleteCollectionItem, ...rest } = useMutation({
    mutationFn,
  });

  return { onDeleteCollectionItem, ...rest };
};
