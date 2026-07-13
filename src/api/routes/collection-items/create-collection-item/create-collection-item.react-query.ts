import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { CreateCollectionItemSchemaDef } from './create-collection-item.types';

import { useInvalidateGetCollectionDetailsById } from '../get-collection-details-by-id/get-collection-details-by-id.react-query';
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
  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const serverFn = useServerFn(createCollectionItemServerFn);

  const { onMutate: onCreateCollectionItem, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add item to collection.',
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

  return { ...rest, onCreateCollectionItem };
};
