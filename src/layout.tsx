import type { RouteComponent } from '@tanstack/react-router';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
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
      <header className="grid justify-items-center px-4 py-4">
        <div className="w-full max-w-7xl">
          <div className="flex items-center gap-4 mb-4 text-white">
            <SportsEsportsIcon
              className="text-inherit text-4xl"
              fontSize="large"
            />
            <h1 className="text-inherit">Start tracking your collection!</h1>
          </div>

          <SimpleErrorBoundary>
            <NavMenu items={navItems} />
          </SimpleErrorBoundary>
        </div>
      </header>

      <div className="grid justify-items-center px-4">
        <main className="w-full max-w-7xl px-4 py-12 bg-white text-black rounded-xl">
          <SimpleErrorBoundary>
            <Outlet />
          </SimpleErrorBoundary>
        </main>
      </div>
      <footer className="grid justify-items-center px-4 py-4">
        <div className="w-full max-w-7xl">PLACEHOLDER FOOTER CONTENT</div>
      </footer>
    </SimpleErrorBoundary>
  );
};
