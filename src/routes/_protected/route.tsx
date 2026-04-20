import { createFileRoute, isRedirect } from '@tanstack/react-router';
import { fetchAllCollectionsServerFn } from '#/api/routes/collections/server/serverFns';
import { getUserContext } from '#/auth/auth.functions';
import { Layout } from '#/layout';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const redirectToSignIn = () => {
      return Route.redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      const user = await getUserContext();
      if (!user) {
        throw redirectToSignIn();
      }

      const collections = await fetchAllCollectionsServerFn();

      return { collections, user };
    } catch (error) {
      // Re-throw redirects (they're intentional, not errors)
      if (isRedirect(error)) {
        throw error;
      }

      // Auth check failed (network error, etc.) - redirect to login
      throw redirectToSignIn();
    }
  },
  component: Layout,
});
