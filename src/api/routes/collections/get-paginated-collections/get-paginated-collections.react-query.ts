import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { reactQueryKeys } from '#/api/react-query-keys';

import { getPaginatedCollectionsServerFn } from './get-paginated-collections.serverFn';

export const useGetPaginatedCollections = () => {
  const queryFn = useServerFn(getPaginatedCollectionsServerFn);

  return useQuery({
    initialData: {
      collections: [],
      pagination: getPaginationMetadataDefaults(10),
    },
    queryFn: () => {
      return queryFn();
    },
    queryKey: [reactQueryKeys.getPaginatedCollections],
  });
};

export const useInvalidateGetPaginatedCollections = (id: number) => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: [reactQueryKeys.getPaginatedCollections, { id }],
    });
  };
};
