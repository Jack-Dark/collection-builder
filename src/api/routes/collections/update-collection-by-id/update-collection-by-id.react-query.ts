import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdateCollectionRequestArgsDef,
  UpdateCollectionResponseDef,
} from './update-collection-by-id.types';

import { updateCollectionByIdServerFn } from './update-collection-by-id.serverFn';

export const useUpdateCollectionById = <
  TTransformedData = UpdateCollectionResponseDef,
>(
  props?: GenericMutateQueryProps<
    UpdateCollectionRequestArgsDef,
    UpdateCollectionResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(updateCollectionByIdServerFn);

  const { onMutate: onUpdateCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    showLoading: true,
    ...props,
  });

  return { ...rest, onUpdateCollectionById };
};
