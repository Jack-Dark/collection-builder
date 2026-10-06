import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCustomFieldValuesResponseDef,
  CreateCustomFieldValuesRequestArgsDef,
} from './create-custom-field-value.types';

import { createCustomFieldValuesServerFn } from './create-custom-field-value.serverFn';

export const useCreateCustomFieldValues = <
  TTransformedData = CreateCustomFieldValuesResponseDef,
>(
  props?: GenericMutateQueryProps<
    CreateCustomFieldValuesRequestArgsDef,
    CreateCustomFieldValuesResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(createCustomFieldValuesServerFn);

  const { onMutate: onCreateCustomFieldValues, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to create custom field value(s).',
      mutationFn: (data) => {
        return serverFn({ data });
      },
      mutationKey: [reactMutationKeys.customFieldValues('create')],
      ...props,
    });

  return { ...rest, onCreateCustomFieldValues };
};
