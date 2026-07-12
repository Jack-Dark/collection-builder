import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionRecordDef } from '../collection.types';
import type { CreateCollectionSchemaDef } from './create-collection.types';

import { createCollectionServerFn } from './create-collection.serverFn';

export const useCreateCollection = <TTransformedData = CollectionRecordDef>(
  props?: GenericMutateQueryProps<
    CreateCollectionSchemaDef,
    CollectionRecordDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(createCollectionServerFn);

  const { onMutate: onCreateCollection, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    ...props,
  });

  return { ...rest, onCreateCollection };
};
