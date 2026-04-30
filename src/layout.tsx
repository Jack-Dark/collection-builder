import type { RouteComponent } from '@tanstack/react-router';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Outlet, useRouter } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';

import type { NavMenuItem } from './components/NavMenu/NavMenu.types';
import type { RouterPath } from './types';

import { useGetAllCollections } from './api/routes/collections/client/hooks';
import { authClient } from './auth/auth-client';
import { NavMenu } from './components/NavMenu';
import { Route as CollectionsRoute } from './routes/_protected/collections';
import { Route as CollectionRoute } from './routes/_protected/collections/$id';

export const Layout: RouteComponent = () => {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const { data: collections } = useGetAllCollections();

  const isLoggedOut = !session?.user.id;

  const navItems: NavMenuItem[] = [
    {
      href: CollectionsRoute.fullPath,
      items: collections?.data?.map((collection) => {
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
    <>
      <header className="grid justify-items-center px-4 py-4">
        <div className="w-full max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <SportsEsportsIcon className="text-4xl" fontSize="large" />
            <h1>Start tracking your game collection!</h1>
          </div>

          <ErrorBoundary
            FallbackComponent={() => {
              return <p>An error occurred...</p>;
            }}
          >
            <NavMenu items={navItems} />
          </ErrorBoundary>
        </div>
      </header>

      <div className="grid justify-items-center px-4">
        <main className="w-full max-w-7xl px-4 py-12 bg-white text-black rounded-xl">
          <ErrorBoundary
            FallbackComponent={() => {
              return <p>An error occurred...</p>;
            }}
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <footer className="grid justify-items-center px-4 py-4">
        <div className="w-full max-w-7xl">PLACEHOLDER FOOTER CONTENT</div>
      </footer>
    </>
  );
};
