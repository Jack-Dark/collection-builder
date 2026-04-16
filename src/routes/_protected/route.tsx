import { createFileRoute, isRedirect } from '@tanstack/react-router';
import { getUserContext } from '#/auth/auth.functions';
import { Layout } from '#/layout';

import { fetchAllCollections } from '../api/collections/route';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    try {
      const user = await getUserContext();
      if (!user) {
        throw Route.redirect({
          search: { redirect: location.href },
          to: '/sign-in',
        });
      }

      return { user };
    } catch (error) {
      // Re-throw redirects (they're intentional, not errors)
      if (isRedirect(error)) {
        throw error;
      }

      // Auth check failed (network error, etc.) - redirect to login
      throw Route.redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    }
  },
  component: Layout,
  loader: async () => {
    const collections = await fetchAllCollections();

    return {
      collections,
    };
  },
});
