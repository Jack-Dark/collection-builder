import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  DeleteCustomFieldValuesResponseDef,
  DeleteCustomFieldValuesRequestArgsDef,
} from './delete-custom-field-values.types';

import { deleteCustomFieldValuesServerFn } from './delete-custom-field-values.serverFn';

export const useDeleteCustomFieldValues = <
  TTransformedData = DeleteCustomFieldValuesResponseDef,
>(
  props?: GenericMutateQueryProps<
    DeleteCustomFieldValuesRequestArgsDef,
    DeleteCustomFieldValuesResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(deleteCustomFieldValuesServerFn);

  const { onMutate: onDeleteCustomFieldValues, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to delete custom field value(s).',
      mutationFn: (data) => {
        return serverFn({ data });
      },
      mutationKey: [reactMutationKeys.customFieldValues('delete')],
      ...props,
    });

  return { ...rest, onDeleteCustomFieldValues };
};
