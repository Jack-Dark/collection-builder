// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from 'react';

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => {
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          content: 'width=device-width, initial-scale=1',
          name: 'viewport',
        },
        {
          title: 'Game Collection Manager',
        },
      ],
    };
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <link href="/src/styles.css" rel="stylesheet" />
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
