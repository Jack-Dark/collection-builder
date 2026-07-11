import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { deleteCollectionByIdServerFn } from './delete-collection-by-id.serverFn';

export const useDeleteCollectionById = () => {
  const mutationFn = useServerFn(deleteCollectionByIdServerFn);

  const { mutate: onDeleteCollection, ...rest } = useMutation({
    mutationFn,
  });

  return { onDeleteCollection, ...rest };
};
