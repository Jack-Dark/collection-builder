import type { RouteComponent } from '@tanstack/react-router';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Outlet, useLocation } from '@tanstack/react-router';

import type { NavMenuItem } from './components/NavMenu/NavMenu.types';

import { authClient } from './auth/auth-client';
import { NavMenu } from './components/NavMenu';

export const Layout: RouteComponent = () => {
  const { pathname } = useLocation();

  const { data: session } = authClient.useSession();

  const isLoggedOut = !session?.user.id;

  const navItems: NavMenuItem[] = [
    { href: '/collection', label: 'Collection' },
    {
      hidden: isLoggedOut,
      href: '/account',
      Icon: () => {
        return <AccountCircleIcon />;
      },
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
