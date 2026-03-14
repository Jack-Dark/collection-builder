import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import type { RouterPath } from './types';

import { authClient } from './utils/auth-client';

export const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState<RouterPath>(
    pathname as RouterPath,
  );

  const { data: session } = authClient.useSession();

  const isLoggedOut = !session?.user.id;

  return (
    <>
      <header>
        <AppBar>
          <h1>Start tracking your game collection!</h1>
          <Tabs
            onChange={(_, value: RouterPath) => {
              setActivePage(value);
              navigate({ to: value });
            }}
            value={activePage}
          >
            <Tab
              disabled={isLoggedOut}
              href={'/collection' satisfies RouterPath}
              label="Collection"
              LinkComponent={(props) => {
                return <Link {...props} to={props.href} />;
              }}
              value={'/collection' satisfies RouterPath}
            />
            <Tab
              href={'/account' satisfies RouterPath}
              label="Account"
              LinkComponent={(props) => {
                return <Link {...props} to={props.href} />;
              }}
              value={'/account' satisfies RouterPath}
            />
          </Tabs>
        </AppBar>
      </header>

      <Box maxWidth="1500px">
        <Outlet />
      </Box>
      <footer>
        {/* 
          // TODO - CREATE FOOTER ?
        */}
      </footer>
    </>
  );
};
