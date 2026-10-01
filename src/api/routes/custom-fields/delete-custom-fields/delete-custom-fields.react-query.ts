import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query-keys';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  DeleteCustomFieldsResponseDef,
  DeleteCustomFieldsRequestArgsDef,
} from './delete-custom-fields.types';

import { deleteCustomFieldsServerFn } from './delete-custom-fields.serverFn';

export const useDeleteCustomFields = <
  TTransformedData = DeleteCustomFieldsResponseDef,
>(
  props?: GenericMutateQueryProps<
    DeleteCustomFieldsRequestArgsDef,
    DeleteCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(deleteCustomFieldsServerFn);

  const { onMutate: onDeleteCustomFields, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to delete custom field.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    mutationKey: [reactMutationKeys.deleteCustomFields],
    ...props,
  });

  return { ...rest, onDeleteCustomFields };
};
