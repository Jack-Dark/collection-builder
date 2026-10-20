import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';
import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';

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
  const invalidateEverything = useInvalidateEverything();

  const { onMutate: onSignOut, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign out. Please try again.',
    mutationFn: signOutServerFn,
    mutationKey: [reactMutationKeys.users.signOut],
    ...props,
    onSuccess: async (...args) => {
      await invalidateEverything({ thenNavigateTo: '/sign-in' });

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onSignOut };
};
