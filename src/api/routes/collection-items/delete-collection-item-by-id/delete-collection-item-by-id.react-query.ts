import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/hooks/use-generic-mutation-query';

import { useGenericMutateQuery } from '#/api/hooks/use-generic-mutation-query';

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
      ...props,
    });

  return { ...rest, onDeleteCollectionItemById };
};
