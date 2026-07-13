import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { SimpleErrorBoundary } from './components/SimpleErrorBoundary';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    context: { queryClient },
    defaultErrorComponent: SimpleErrorBoundary,
    defaultNotFoundComponent: () => {
      return <p>404 NOT FOUND</p>;
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
