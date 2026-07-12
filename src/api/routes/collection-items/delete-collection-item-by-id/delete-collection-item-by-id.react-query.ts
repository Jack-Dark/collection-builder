import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { DeleteCollectionItemByIdSchemaDef } from './delete-collection-item-by-id.type';

import { useInvalidateGetCollectionDetailsById } from '../get-collection-details-by-id/get-collection-details-by-id.react-query';
import { deleteCollectionItemByIdServerFn } from './delete-collection-item-by-id.serverFn';

export const useDeleteCollectionItemById = <TTransformedData = void>(
  props?: GenericMutateQueryProps<
    DeleteCollectionItemByIdSchemaDef,
    void,
    TTransformedData
  >,
) => {
  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const serverFn = useServerFn(deleteCollectionItemByIdServerFn);

  const { onMutate: onDeleteCollectionItemById, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to delete collection.',
      mutationFn: (data) => {
        return serverFn({ data });
      },
      ...props,
      onSuccess: async (...args) => {
        invalidateGetCollectionDetailsById();

        await props?.onSuccess?.(...args);
      },
    });

  return { ...rest, onDeleteCollectionItemById };
};
