import { createFileRoute, isRedirect } from '@tanstack/react-router';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { getNavMenuCollectionsServerFn } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.serverFn';
import { getUserContext } from '#/auth/auth.functions';
import { SimpleErrorBoundaryContent } from '#/components/SimpleErrorBoundary';
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

      return { user };
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
  errorComponent: SimpleErrorBoundaryContent,
  loader: async ({ context }) => {
    const queryOptions = getGenericFetchQueryOptions({
      queryFn: getNavMenuCollectionsServerFn,
      queryKey: [reactQueryKeys.getNavMenuCollections],
      requestArgs: {},
    });

    return await context.queryClient.ensureQueryData(queryOptions);
  },
});
