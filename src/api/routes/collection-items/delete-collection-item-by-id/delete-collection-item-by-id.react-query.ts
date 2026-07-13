import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { DeleteCollectionItemByIdSchemaDef } from './delete-collection-item-by-id.type';

import { deleteCollectionItemByIdServerFn } from './delete-collection-item-by-id.serverFn';

export const useDeleteCollectionItemById = <TTransformedData = void>(
  props?: GenericMutateQueryProps<
    DeleteCollectionItemByIdSchemaDef,
    void,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(deleteCollectionItemByIdServerFn);

  const { onMutate: onDeleteCollectionItemById, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to delete collection.',
      mutationFn: (data) => {
        return serverFn({ data });
      },
      showLoading: true,
      ...props,
    });

  return { ...rest, onDeleteCollectionItemById };
};
