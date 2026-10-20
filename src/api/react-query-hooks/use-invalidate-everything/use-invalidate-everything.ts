import { useNavigate, useRouter } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { useNotifications } from '#/components/Notifications/useNotifications';
import { queryClient } from '#/router';

export const useInvalidateEverything = () => {
  const { clearAllNotifications } = useNotifications();

  const router = useRouter();
  const navigate = useNavigate();

  return async (options?: { thenNavigateTo: RouterPath }) => {
    await router.invalidate();

    clearAllNotifications();

    queryClient.clear();

    if (options?.thenNavigateTo) {
      navigate({
        to: options.thenNavigateTo,
      });
    }
  };
};
