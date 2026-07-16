import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { DeleteCollectionItemsByIdsSchemaDef } from './delete-collection-items-by-ids.type';

import { deleteCollectionItemsByIdsServerFn } from './delete-collection-items-by-ids.serverFn';

export const useDeleteCollectionItemsByIds = <TTransformedData = void>(
  props?: GenericMutateQueryProps<
    DeleteCollectionItemsByIdsSchemaDef,
    void,
    TTransformedData
  >,
) => {
  const { onMutate: onDeleteCollectionItemsByIds, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to delete collection.',
      mutationFn: (data) => {
        return deleteCollectionItemsByIdsServerFn({ data });
      },
      showLoading: true,
      ...props,
    });

  return { ...rest, onDeleteCollectionItemsByIds };
};
