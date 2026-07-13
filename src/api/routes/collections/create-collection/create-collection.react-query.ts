import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCollectionResponseDef,
  CreateCollectionRequestArgsDef,
} from './create-collection.types';

import { createCollectionServerFn } from './create-collection.serverFn';

export const useCreateCollection = <
  TTransformedData = CreateCollectionResponseDef,
>(
  props?: GenericMutateQueryProps<
    CreateCollectionRequestArgsDef,
    CreateCollectionResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(createCollectionServerFn);

  const { onMutate: onCreateCollection, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    showLoading: true,
    ...props,
  });

  return { ...rest, onCreateCollection };
};
