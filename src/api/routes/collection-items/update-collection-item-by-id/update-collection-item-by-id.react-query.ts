import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { UpdateCollectionItemSchemaDef } from './update-collection-item-by-id.types';

import { useInvalidateGetCollectionDetailsById } from '../get-collection-details-by-id/get-collection-details-by-id.react-query';
import { updateCollectionItemByIdServerFn } from './update-collection-item-by-id.serverFn';

export const useUpdateCollectionItemById = <
  TTransformedData = CollectionItemRecordDef,
>(
  props?: GenericMutateQueryProps<
    UpdateCollectionItemSchemaDef,
    CollectionItemRecordDef,
    TTransformedData
  >,
) => {
  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const serverFn = useServerFn(updateCollectionItemByIdServerFn);

  const { onMutate: onUpdateCollectionItemById, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to update collection item.',
      mutationFn: (data) => {
        return serverFn({ data });
      },
      showLoading: true,
      ...props,
      onSuccess: async (...args) => {
        invalidateGetCollectionDetailsById();

        await props?.onSuccess?.(...args);
      },
    });

  return { ...rest, onUpdateCollectionItemById };
};
