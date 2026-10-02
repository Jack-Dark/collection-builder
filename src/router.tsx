import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { SimpleErrorBoundary } from './components/SimpleErrorBoundary';
import { RootDocument } from './routes/__root';
import { routeTree } from './routeTree.gen';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      throwOnError: true,
    },
  },
});

export function getRouter() {
  const router = createRouter({
    context: { queryClient },
    defaultErrorComponent: SimpleErrorBoundary,
    defaultNotFoundComponent: () => {
      return (
        <RootDocument>
          <p>Not Found</p>
        </RootDocument>
      );
    },
    defaultPreload: 'intent',
    routeTree,
  });

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  });

  return router;
}
