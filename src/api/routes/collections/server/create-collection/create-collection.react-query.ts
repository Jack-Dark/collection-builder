import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { createCollectionServerFn } from './create-collection.serverFn';

export const useCreateCollection = (
  props?: Omit<Parameters<typeof useMutation>[0], 'mutationFn'>,
) => {
  const mutationFn = useServerFn(createCollectionServerFn);

  const { mutate: onCreateCollection, ...rest } = useMutation({
    mutationFn,
    ...props,
    onSuccess: async (data, ...rest) => {
      const { id } = data;
      const invalidateQuery = useInvalidateGetPaginatedCollections(id);
      await invalidateQuery();
      props?.onSuccess?.(data, ...rest);
    },
  });

  return { onCreateCollection, ...rest };
};
