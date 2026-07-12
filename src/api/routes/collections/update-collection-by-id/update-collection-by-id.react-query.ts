import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionRecordDef } from '../collection.types';
import type { UpdateCollectionSchemaDef } from './update-collection-by-id.types';

import { updateCollectionByIdServerFn } from './update-collection-by-id.serverFn';

export const useUpdateCollectionById = <TTransformedData = CollectionRecordDef>(
  props?: GenericMutateQueryProps<
    UpdateCollectionSchemaDef,
    CollectionRecordDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(updateCollectionByIdServerFn);

  const { onMutate: onUpdateCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    ...props,
  });

  return { ...rest, onUpdateCollectionById };
};
