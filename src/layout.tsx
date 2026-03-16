import { Tabs } from '@base-ui/react/tabs';
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
      <header>
        <h1>Start tracking your game collection!</h1>

        <Tabs.Root defaultValue={defaultTab}>
          <Tabs.List>
            {navItems.map(({ href, label }) => {
              return (
                <Tabs.Tab key={href} value={href}>
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
      </header>

      <div>
        <Outlet />
      </div>
      <footer>
        {/* 
          // TODO - CREATE FOOTER ?
        */}
      </footer>
    </>
  );
};
