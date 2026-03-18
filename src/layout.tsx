import { Tabs } from '@base-ui/react/tabs';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import type { RouterPath } from './types';

import { authClient } from './utils/auth-client';

const navItems = [
  { href: '/collection', label: 'Collection' },
  { href: '/account', label: 'Account' },
] satisfies {
  href: RouterPath;
  label: string;
}[];

export const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const defaultTab = pathname as RouterPath;
  const [activePage, setActivePage] = useState<RouterPath>(defaultTab);

  const { data: session } = authClient.useSession();

  const isLoggedOut = !session?.user.id;

  return (
    <>
      <header className="grid justify-items-center">
        <div className="w-full max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4 mb-8">
            <SportsEsportsIcon className="text-4xl" fontSize="large" />
            <h1>Start tracking your game collection!</h1>
          </div>

          <Tabs.Root defaultValue={defaultTab}>
            <Tabs.List>
              {navItems.map(({ href, label }) => {
                return (
                  <Tabs.Tab className="pv-2 px-3" key={href} value={href}>
                    <Link to={href}>
                      <p>{label}</p>
                    </Link>
                  </Tabs.Tab>
                );
              })}
              <Tabs.Indicator />
            </Tabs.List>
            {/* <Tabs.Panel value={'/account' satisfies RouterPath} /> */}
          </Tabs.Root>
        </div>
      </header>

      <div className="grid justify-items-center px-4">
        <main className="w-full max-w-7xl px-4 py-12 bg-white text-black rounded-xl">
          <Outlet />
        </main>
      </div>
      <footer className="grid justify-items-center">
        <div className="w-full max-w-7xl px-4 py-4">placeholder content</div>
      </footer>
    </>
  );
};
