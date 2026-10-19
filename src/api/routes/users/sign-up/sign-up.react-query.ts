import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { SignUpRequestArgsDef, SignUpResponseDef } from './sign-up.types';

import { signUpServerFn } from './sign-up.serverFn';

export const useSignUp = <TTransformedData = SignUpResponseDef>(
  props?: GenericMutateQueryProps<
    SignUpRequestArgsDef,
    SignUpResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onSignUp, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign up.',
    mutationFn: (data) => {
      return signUpServerFn({ data });
    },
    mutationKey: [reactMutationKeys.users.signUp.viaEmail],
    ...props,
  });

  return { ...rest, onSignUp };
};
