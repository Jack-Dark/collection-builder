import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { createCollectionItemServerFn } from './create-collection-item.serverFn';

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
