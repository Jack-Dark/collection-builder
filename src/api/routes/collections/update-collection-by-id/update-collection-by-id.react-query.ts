import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionRecordDef } from '../collection.types';
import type { UpdateCollectionsFormRecordSchemaDef } from './update-collection-by-id.types';

import { useInvalidateGetNavMenuCollections } from '../get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { updateCollectionByIdServerFn } from './update-collection-by-id.serverFn';

export const useUpdateCollectionById = <
  TTransformedData = CollectionRecordDef[],
>(
  props?: GenericMutateQueryProps<
    UpdateCollectionsFormRecordSchemaDef[],
    CollectionRecordDef[],
    TTransformedData
  >,
) => {
  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onMutate: onUpdateCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection.',
    mutationFn: (records) => {
      return updateCollectionByIdServerFn({ data: { records } });
    },
    showLoading: true,
    ...props,
    onSuccess: async (data, requestArgs) => {
      await invalidateGetNavMenuCollections();
      await invalidateGetPaginatedCollections();

      await props?.onSuccess?.(data, requestArgs);
    },
  });

  return { ...rest, onUpdateCollectionById };
};
