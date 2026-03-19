import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { Layout } from '#/layout';
import { getUserContext } from '#/auth/auth.functions';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    try {
      const user = await getUserContext();
      if (!user) {
        throw redirect({
          to: '/sign-in',
          search: { redirect: location.href },
        });
      }
      return { user };
    } catch (error) {
      // Re-throw redirects (they're intentional, not errors)
      if (isRedirect(error)) {
        throw error;
      }

      // Auth check failed (network error, etc.) - redirect to login
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      });
    }
  },
  component: Layout,
});
