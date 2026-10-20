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

      <Outlet />
    </SimpleErrorBoundary>
  );
};
