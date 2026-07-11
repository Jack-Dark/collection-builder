import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { updateCollectionByIdServerFn } from './update-collection-by-id.serverFn';

export const useUpdateCollectionById = (
  props?: Omit<Parameters<typeof useMutation>[0], 'mutationFn'>,
) => {
  const mutationFn = useServerFn(updateCollectionByIdServerFn);

  const { mutate: onUpdateCollection, ...rest } = useMutation({
    mutationFn,
    ...props,
    onSuccess: async (data, ...rest) => {
      const { id } = data;
      const invalidateQuery = useInvalidateGetPaginatedCollections(id);
      await invalidateQuery();
      props?.onSuccess?.(data, ...rest);
    },
  });

  return { onUpdateCollection, ...rest };
};
