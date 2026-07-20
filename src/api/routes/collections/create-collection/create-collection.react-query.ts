import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCollectionResponseDef,
  OnCreateCollectionRequestArgsDef,
} from './create-collection.types';

import { useInvalidateGetNavMenuCollections } from '../get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { createCollectionServerFn } from './create-collection.serverFn';

export const useCreateCollection = <
  TTransformedData = CreateCollectionResponseDef,
>(
  props?: GenericMutateQueryProps<
    OnCreateCollectionRequestArgsDef,
    CreateCollectionResponseDef,
    TTransformedData
  >,
) => {
  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onMutate: onCreateCollection, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add collection.',
    mutationFn: ({ records }) => {
      return createCollectionServerFn({
        data: { records },
      });
    },
    mutationKey: ['create-collections'],
    showLoading: true,
    ...props,
    onSuccess: async (data, requestArgs) => {
      await invalidateGetNavMenuCollections();
      await invalidateGetPaginatedCollections();

      await props?.onSuccess?.(data, requestArgs);
    },
  });

  return { ...rest, onCreateCollection };
};
