import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCollectionResponseDef,
  CreateCollectionRequestArgsDef,
} from './create-collection.types';

import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { createCollectionServerFn } from './create-collection.serverFn';

export const useCreateCollection = <
  TTransformedData = CreateCollectionResponseDef,
>(
  props: GenericMutateQueryProps<
    CreateCollectionRequestArgsDef,
    CreateCollectionResponseDef,
    TTransformedData
  >,
) => {
  const { onSuccess, ...queryProps } = props;

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const serverFn = useServerFn(createCollectionServerFn);

  const { onMutate: onCreateCollection, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    onSuccess: async (...args) => {
      invalidateGetPaginatedCollections();

      await onSuccess?.(...args);
    },
    ...queryProps,
  });

  return { ...rest, onCreateCollection };
};
