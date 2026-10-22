import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  ImpersonateUserStopRequestArgsDef,
  ImpersonateUserStopResponseDef,
} from './impersonate-user-stop.types';

import { impersonateUserStopServerFn } from './impersonate-user-stop.serverFn';

export const useImpersonateUserStop = <
  TTransformedData = ImpersonateUserStopResponseDef,
>(
  props?: GenericMutateQueryProps<
    ImpersonateUserStopRequestArgsDef,
    ImpersonateUserStopResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onImpersonateUserStop, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to stop impersonating user.',
    mutationFn: async () => {
      await impersonateUserStopServerFn();
    },
    mutationKey: [reactMutationKeys.users.impersonateStop],
    ...props,
  });

  return { ...rest, onImpersonateUserStop };
};
