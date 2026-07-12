import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { CreateCollectionItemSchemaDef } from './create-collection-item.types';

import { createCollectionItemServerFn } from './create-collection-item.serverFn';

export const useCreateCollectionItem = <
  TTransformedData = CollectionItemRecordDef,
>(
  props?: GenericMutateQueryProps<
    CreateCollectionItemSchemaDef,
    CollectionItemRecordDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(createCollectionItemServerFn);

  const { onMutate: onCreateCollectionItem, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add item to collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    ...props,
  });

  return { ...rest, onCreateCollectionItem };
};
