import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { queryKeys } from '#/api/queryKeys';

import {
  createCollectionItemServerFn,
  deleteCollectionItemServerFn,
  getCollectionItemServerFn,
  updateCollectionItemSeverFn,
} from '../server/serverFns';

export const useGetCollectionItem = (collectionItemId: number) => {
  const queryFn = useServerFn(getCollectionItemServerFn);

  return useQuery({
    queryFn: () => {
      return queryFn({ data: { collectionItemId } });
    },
    queryKey: [queryKeys.getCollectionItems, { collectionItemId }],
  });
};

const useInvalidateGetCollectionItem = (id: number) => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: [queryKeys.getCollectionItems, { id }],
    });
  };
};

export const useCreateCollectionItem = () => {
  const mutationFn = useServerFn(createCollectionItemServerFn);

  const { mutate: onCreateCollectionItem, ...rest } = useMutation({
    mutationFn,
  });

  return { onCreateCollectionItem, ...rest };
};

export const useUpdateCollectionItem = () => {
  const mutationFn = useServerFn(updateCollectionItemSeverFn);

  const { mutate: onUpdateCollectionItem, ...rest } = useMutation({
    mutationFn,
    onSuccess: async ({ id }) => {
      const invalidateQuery = useInvalidateGetCollectionItem(id);
      await invalidateQuery();
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
