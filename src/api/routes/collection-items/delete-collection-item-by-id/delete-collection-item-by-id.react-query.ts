import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { deleteCollectionItemByIdServerFn } from './delete-collection-item-by-id.serverFn';

export const useDeleteCollectionItemById = () => {
  const mutationFn = useServerFn(deleteCollectionItemByIdServerFn);

  const { mutate: onDeleteCollectionItem, ...rest } = useMutation({
    mutationFn,
  });

  return { onDeleteCollectionItem, ...rest };
};
