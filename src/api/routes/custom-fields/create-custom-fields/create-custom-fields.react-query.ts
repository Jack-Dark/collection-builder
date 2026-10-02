import { useServerFn } from '@tanstack/react-start';

import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCustomFieldsResponseDef,
  CreateCustomFieldsRequestArgsDef,
} from './create-custom-fields.types';

import { createCustomFieldsServerFn } from './create-custom-fields.serverFn';

export const useCreateCustomFields = <
  TTransformedData = CreateCustomFieldsResponseDef,
>(
  props?: GenericMutateQueryProps<
    CreateCustomFieldsRequestArgsDef,
    CreateCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  const serverFn = useServerFn(createCustomFieldsServerFn);

  const { onMutate: onCreateCustomFields, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to create custom field.',
    mutationFn: (data) => {
      return serverFn({ data });
    },
    mutationKey: [reactMutationKeys.createCustomFields],
    ...props,
  });

  return { ...rest, onCreateCustomFields };
};
