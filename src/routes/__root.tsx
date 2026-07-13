/// <reference types="vite/client" />

import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { FormDevtoolsPanel } from '@tanstack/react-form-devtools';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { StrictMode } from 'react';

import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { reactQueryKeys } from '#/api/react-query-hooks/use-generic-fetch-query/react-query-keys';
import { getNavMenuCollectionsServerFn } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.serverFn';
import { DialogProvider } from '#/components/Dialog/Dialog.Provider';

import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  errorComponent: () => {
    return <p>An Error Occurred</p>;
  },
  head: () => {
    return {
      links: [
        {
          href: appCss,
          rel: 'stylesheet',
        },
      ],
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          content: 'width=device-width, initial-scale=1',
          name: 'viewport',
        },
        {
          title: 'Collection Manager',
        },
      ],
    };
  },
  loader: async ({ context }) => {
    const queryOptions = getGenericFetchQueryOptions({
      groupName: reactQueryKeys.getNavMenuCollections,
      queryFn: getNavMenuCollectionsServerFn,
      requestArgs: {},
    });

    return await context.queryClient.ensureQueryData(queryOptions);
  },
  notFoundComponent: () => {
    return <p>Not Found</p>;
  },
});

function RootComponent() {
  const queryClient = useQueryClient();

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RootDocument>
          <Outlet />
        </RootDocument>
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Form',
              render: <FormDevtoolsPanel />,
            },
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </QueryClientProvider>
    </StrictMode>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>

      <DialogProvider>
        <body className="bg-linear-to-b from-primary-900 to-secondary-900 root grid min-h-dvh grid-rows-[max-content_1fr_max-content]">
          {children}
          <Scripts />
        </body>
      </DialogProvider>
    </html>
  );
}
