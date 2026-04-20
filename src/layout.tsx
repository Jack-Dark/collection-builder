import type { RouteComponent } from '@tanstack/react-router';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useRouter } from '@tanstack/react-router';

import type { NavMenuItem } from './components/NavMenu/NavMenu.types';
import type { RouterPath } from './types';

import { authClient } from './auth/auth-client';
import { NavMenu } from './components/NavMenu';
import { Route as CollectionsRoute } from './routes/_protected/collections/$id';
import { Route as CollectionsAddRoute } from './routes/_protected/collections/add';
import { fetchAllCollections } from './routes/api/collections/route';

export const Layout: RouteComponent = () => {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const { data } = useQuery({
    enabled: true,
    initialData: [],
    queryFn: async () => {
      const { data } = await fetchAllCollections();

      return data;
    },
    queryKey: ['fetch-all-collections'],
  });

  const isLoggedOut = !session?.user.id;

  const navItems: NavMenuItem[] = [
    {
      href: CollectionsAddRoute.fullPath,
      items: data.map((collection) => {
        return {
          href: CollectionsRoute.fullPath.replace('$id', String(collection.id)),
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

          <NavMenu items={navItems} />
        </div>
      </header>

      <div className="grid justify-items-center px-4">
        <main className="w-full max-w-7xl px-4 py-12 bg-white text-black rounded-xl">
          <Outlet />
        </main>
      </div>
      <footer className="grid justify-items-center px-4 py-4">
        <div className="w-full max-w-7xl">PLACEHOLDER FOOTER CONTENT</div>
      </footer>
    </>
  );
};
