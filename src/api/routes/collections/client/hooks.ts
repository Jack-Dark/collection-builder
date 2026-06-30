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

export const useGetCollection = (collectionId: number) => {
  const queryFn = useServerFn(getCollectionServerFn);

  return useQuery({
    queryFn: () => {
      return queryFn({ data: { collectionId } });
    },
    queryKey: [queryKeys.getCollection, { id: collectionId }],
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

export const useCreateCollection = (
  props?: Omit<Parameters<typeof useMutation>[0], 'mutationFn'>,
) => {
  const mutationFn = useServerFn(createCollectionServerFn);

  const { mutate: onCreateCollection, ...rest } = useMutation({
    mutationFn,
    ...props,
    onSuccess: async (data, ...rest) => {
      const { id } = data;
      const invalidateQuery = useInvalidateGetCollection(id);
      await invalidateQuery();
      props?.onSuccess?.(data, ...rest);
    },
  });

  return { onCreateCollection, ...rest };
};

export const useUpdateCollection = (
  props?: Omit<Parameters<typeof useMutation>[0], 'mutationFn'>,
) => {
  const mutationFn = useServerFn(updateCollectionSeverFn);

  const { mutate: onUpdateCollection, ...rest } = useMutation({
    mutationFn,
    ...props,
    onSuccess: async (data, ...rest) => {
      const { id } = data;
      const invalidateQuery = useInvalidateGetCollection(id);
      await invalidateQuery();
      props?.onSuccess?.(data, ...rest);
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
