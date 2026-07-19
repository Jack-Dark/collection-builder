import type { RouteComponent } from '@tanstack/react-router';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Outlet, useRouter } from '@tanstack/react-router';

import type { NavMenuItem } from './components/NavMenu/NavMenu.types';
import type { RouterPath } from './types';

import { useGetNavMenuCollections } from './api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { authClient } from './auth/auth-client';
import { FullPageLoadingSpinner } from './components/FullPageLoadingSpinner';
import { NavMenu } from './components/NavMenu';
import { Notifications } from './components/Notifications';
import { SimpleErrorBoundary } from './components/SimpleErrorBoundary';
import { Route as CollectionsRoute } from './routes/_protected/collections';
import { Route as CollectionRoute } from './routes/_protected/collections/$id';

export const Layout: RouteComponent = () => {
  const { data } = useGetNavMenuCollections({
    requestArgs: {},
  });

  const { collections } = data;

  const router = useRouter();

  const { data: session } = authClient.useSession();

  const isLoggedOut = !session?.user.id;

  const navItems: NavMenuItem[] = [
    {
      href: CollectionsRoute.fullPath,
      items: collections?.map((collection) => {
        return {
          href: CollectionRoute.fullPath.replace('$id', String(collection.id)),
          label: collection.name,
        };
      }),
      label: 'Collections',
    },
    {
      href: '/account' satisfies RouterPath,
      Icon: AccountCircleIcon,
      items: [
        {
          hidden: isLoggedOut,
          href: '/sign-out',
          label: 'Sign out',
          onClick: async (e) => {
            e.preventDefault();

            await authClient.signOut();
            router.navigate({ to: '/sign-in' });
          },
        },
      ],
      label: 'Account',
    },
  ];

  return (
    <SimpleErrorBoundary>
      <FullPageLoadingSpinner />
      <Notifications />
      <div className="grid h-dvh grid-rows-[auto_1fr] w-full max-w-500 gap-4 p-4">
        <header className="grid gap-4">
          <div className="flex items-center gap-2 text-white">
            <ListAltIcon className="text-inherit text-4xl" fontSize="large" />
            <h1 className="text-inherit">Start tracking your collection!</h1>
          </div>

          <SimpleErrorBoundary>
            <NavMenu items={navItems} />
          </SimpleErrorBoundary>
        </header>

        <main className="w-full px-4 pt-6 pb-4 bg-white text-black rounded-xs">
          <SimpleErrorBoundary>
            <Outlet />
          </SimpleErrorBoundary>
        </main>

        {/* <footer className="grid p-4">PLACEHOLDER FOOTER CONTENT</footer> */}
      </div>
    </SimpleErrorBoundary>
  );
};
