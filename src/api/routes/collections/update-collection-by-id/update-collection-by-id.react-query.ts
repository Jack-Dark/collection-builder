import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdateCollectionRequestArgsDef,
  UpdateCollectionResponseDef,
} from './update-collection-by-id.types';

import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { updateCollectionByIdServerFn } from './update-collection-by-id.serverFn';

export const useUpdateCollectionById = <
  TTransformedData = UpdateCollectionResponseDef,
>(
  props: GenericMutateQueryProps<
    UpdateCollectionRequestArgsDef,
    UpdateCollectionResponseDef,
    TTransformedData
  >,
) => {
  const { onSuccess, ...queryProps } = props;

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const serverFn = useServerFn(updateCollectionByIdServerFn);

  const { onMutate: onUpdateCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    onSuccess: async (...args) => {
      invalidateGetPaginatedCollections();

      await onSuccess?.(...args);
    },
    ...queryProps,
  });

  return { ...rest, onUpdateCollectionById };
};
