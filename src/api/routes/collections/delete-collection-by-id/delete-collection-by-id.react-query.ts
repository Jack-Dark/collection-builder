import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { DeleteCollectionByIdSchemaDef } from './delete-collection-by-id.types';

import { deleteCollectionByIdServerFn } from './delete-collection-by-id.serverFn';

export const useDeleteCollectionById = <TTransformedData = void>(
  props?: GenericMutateQueryProps<
    DeleteCollectionByIdSchemaDef,
    void,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(deleteCollectionByIdServerFn);

  const { onMutate: onDeleteCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to delete item from collection.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    ...props,
  });

  return { ...rest, onDeleteCollectionById };
};
