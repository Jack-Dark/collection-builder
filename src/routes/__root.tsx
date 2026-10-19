/// <reference types="vite/client" />

import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
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

import { getSession } from '#/auth/auth-middleware';
import { DialogProvider } from '#/components/Dialog/Dialog.Provider';
import { SimpleErrorBoundaryContent } from '#/components/SimpleErrorBoundary';
import { ThemeProvider } from '#/components/ThemeProvider';
import { getThemeServerFn } from '#/lib/theme';

import appCss from '../styles.css?url';

// TODO - REQUIRED FEATURE CREATE HOMEPAGE
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    const session = await getSession();

    return { user: session?.user };
  },
  component: RootComponent,
  errorComponent: SimpleErrorBoundaryContent,
  loader: async () => {
    const theme = await getThemeServerFn();

    return { theme };
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
          // TODO - REQUIRED FEATURE: UPDATE PAGE TITLE FOR EACH UNIQUE PAGE TYPE
          title: 'Collection Tracker',
        },
      ],
    };
  },
  notFoundComponent: () => {
    return (
      <RootDocument>
        <p>Not Found</p>
      </RootDocument>
    );
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
            formDevtoolsPlugin(),
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

export const RootDocument = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const { theme } = Route.useLoaderData();

  return (
    <html data-theme={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <ThemeProvider theme={theme}>
        <DialogProvider>
          <body className="bg-linear-to-br from-primary-900 to-secondary-900 dark:from-primary-950 dark:to-secondary-950 root grid min-h-dvh grid-rows-[max-content_1fr_max-content] text-theme-t1">
            {children}
            <Scripts />
          </body>
        </DialogProvider>
      </ThemeProvider>
    </html>
  );
};
