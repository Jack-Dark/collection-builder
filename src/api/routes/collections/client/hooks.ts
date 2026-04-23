import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { getPaginationMetadataDefaults } from '#/api/pagination/constants';
import { queryKeys } from '#/api/queryKeys';

import {
  createCollectionServerFn,
  deleteCollectionServerFn,
  getAllCollectionsServerFn,
  getCollectionServerFn,
  updateCollectionSeverFn,
} from '../server/serverFns';

export const useGetAllCollections = () => {
  const queryFn = useServerFn(getAllCollectionsServerFn);

  return useQuery({
    initialData: { data: [], metadata: getPaginationMetadataDefaults(10) },
    queryFn: () => {
      return queryFn();
    },
    queryKey: [queryKeys.getCollection],
  });
};

export const useGetCollection = (id: number) => {
  const queryFn = useServerFn(getCollectionServerFn);

  return useQuery({
    queryFn: () => {
      return queryFn({ data: id });
    },
    queryKey: [queryKeys.getCollection, { id }],
  });
};

const useInvalidateGetCollection = (id: number) => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: [queryKeys.getCollection, { id }],
    });
  };
};

export const useCreateCollection = () => {
  const mutationFn = useServerFn(createCollectionServerFn);

  const { mutate: onCreateCollection, ...rest } = useMutation({
    mutationFn,
  });

  return { onCreateCollection, ...rest };
};

export const useUpdateCollection = () => {
  const mutationFn = useServerFn(updateCollectionSeverFn);

  const { mutate: onUpdateCollection, ...rest } = useMutation({
    mutationFn,
    onSuccess: async ({ id }) => {
      const invalidateQuery = useInvalidateGetCollection(id);
      await invalidateQuery();
    },
  });

  return { onUpdateCollection, ...rest };
};

export const useDeleteCollection = () => {
  const mutationFn = useServerFn(deleteCollectionServerFn);

  const { mutate: onDeleteCollection, ...rest } = useMutation({
    mutationFn,
  });

  return { onDeleteCollection, ...rest };
};
