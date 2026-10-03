import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdateCustomFieldsResponseDef,
  UpdateCustomFieldsRequestArgsDef,
} from './update-custom-fields.types';

import { updateCustomFieldsServerFn } from './update-custom-fields.serverFn';

export const useUpdateCustomFields = <
  TTransformedData = UpdateCustomFieldsResponseDef,
>(
  props?: GenericMutateQueryProps<
    UpdateCustomFieldsRequestArgsDef,
    UpdateCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(updateCustomFieldsServerFn);

  const { onMutate: onUpdateCustomFields, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to create custom field.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    mutationKey: [reactMutationKeys.updateCustomFields],
    ...props,
  });

  return { ...rest, onUpdateCustomFields };
};
