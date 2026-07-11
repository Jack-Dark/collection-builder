import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { reactQueryKeys } from '#/api/react-query-keys';

import { deleteCollectionByIdServerFn } from '../server/delete-collection-by-id/delete-collection-by-id.serverFn';
import { getCollectionByIdServerFn } from '../server/get-collection-by-id/get-collection-by-id.serverFn';
import { createCollectionServerFn } from '../server/create-collection/create-collection.serverFn';
import { getAllCollectionsServerFn } from '../server/get-all-collections/get-all-collections.serverFn';
import { updateCollectionByIdServerFn } from '../server/update-collection-by-id/update-collection-by-id.serverFn';

export const useGetAllCollections = () => {
  const queryFn = useServerFn(getAllCollectionsServerFn);

  return useQuery({
    initialData: {
      collections: [],
      pagination: getPaginationMetadataDefaults(10),
    },
    queryFn: () => {
      return queryFn();
    },
    queryKey: [reactQueryKeys.getCollection],
  });
};

export const useGetCollection = (collectionId: number) => {
  const queryFn = useServerFn(getCollectionByIdServerFn);

  return useQuery({
    queryFn: () => {
      return queryFn({ data: { collectionId } });
    },
    queryKey: [reactQueryKeys.getCollection, { id: collectionId }],
  });
};

const useInvalidateGetCollection = (id: number) => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: [reactQueryKeys.getCollection, { id }],
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
  const mutationFn = useServerFn(updateCollectionByIdServerFn);

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
  const mutationFn = useServerFn(deleteCollectionByIdServerFn);

  const { mutate: onDeleteCollection, ...rest } = useMutation({
    mutationFn,
  });

  return { onDeleteCollection, ...rest };
};
