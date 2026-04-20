/// <reference types="vite/client" />

import type { ReactNode } from 'react';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { StrictMode } from 'react';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
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
  notFoundComponent: () => {
    return <p>Not Found</p>;
  },
});

const queryClient = new QueryClient();

function RootComponent() {
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

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-linear-to-b from-primary-900 to-secondary-900 text-white">
        <div className="root grid min-h-dvh grid-rows-[max-content_1fr_max-content]">
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
