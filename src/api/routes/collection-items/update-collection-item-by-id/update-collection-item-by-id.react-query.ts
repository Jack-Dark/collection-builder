import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { UpdateCollectionItemSchemaDef } from './update-collection-item-by-id.types';

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
  const serverFn = useServerFn(updateCollectionItemByIdServerFn);

  const { onMutate: onUpdateCollectionItemById, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to update collection item.',
      mutationFn: (data) => {
        return serverFn({ data });
      },
      ...props,
    });

  return { ...rest, onUpdateCollectionItemById };
};
