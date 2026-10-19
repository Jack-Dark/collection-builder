import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  SignOutRequestArgsDef,
  SignOutResponseDef,
} from './sign-out.types';

import { signOutServerFn } from './sign-out.serverFn';

export const useSignOut = <TTransformedData = SignOutResponseDef>(
  props?: GenericMutateQueryProps<
    SignOutRequestArgsDef,
    SignOutResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onSignOut, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign out.',
    mutationFn: signOutServerFn,
    mutationKey: [reactMutationKeys.users.signOut],
    ...props,
  });

  return { ...rest, onSignOut };
};
