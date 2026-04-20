import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import {
  createCollectionItemServerFn,
  deleteCollectionItemServerFn,
  getCollectionItemServerFn,
  updateCollectionItemSeverFn,
} from '../server/serverFns';

const queryKey = 'get-collection-item';

export const useGetCollectionItem = (id: number) => {
  const queryFn = useServerFn(getCollectionItemServerFn);

  return useQuery({
    queryFn: () => {
      return queryFn({ data: id });
    },
    queryKey: [queryKey, { id }],
  });
};

const useInvalidateGetCollectionItem = (id: number) => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: [queryKey, { id }],
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
