import type { RouteComponent } from '@tanstack/react-router';

import { Outlet } from '@tanstack/react-router';

import { FullPageLoadingSpinner } from './components/FullPageLoadingSpinner';
import { Notifications } from './components/Notifications';
import { SimpleErrorBoundary } from './components/SimpleErrorBoundary';

export const Layout: RouteComponent = () => {
  return (
    <SimpleErrorBoundary>
      <FullPageLoadingSpinner />
      <Notifications />
      <div
        className="p-4 h-dvh overflow-hidden size-full grid grid-rows-[auto_1fr] gap-4"
        suppressHydrationWarning
      >
        <Outlet />
      </div>
    </SimpleErrorBoundary>
  );
};
