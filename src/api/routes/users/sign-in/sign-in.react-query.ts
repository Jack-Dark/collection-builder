import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { SignInRequestArgsDef, SignInResponseDef } from './sign-in.types';

import { signInServerFn } from './sign-in.serverFn';

export const useSignIn = <TTransformedData = SignInResponseDef>(
  props?: GenericMutateQueryProps<
    SignInRequestArgsDef,
    SignInResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onSignIn, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign in.',
    mutationFn: (data) => {
      return signInServerFn({ data });
    },
    mutationKey: [reactMutationKeys.users.signIn.viaEmail],
    ...props,
  });

  return { ...rest, onSignIn };
};
