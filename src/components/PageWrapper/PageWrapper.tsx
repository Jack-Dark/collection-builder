import type { PropsWithChildren } from 'react';

import CoffeeIcon from '@mui/icons-material/Coffee';
import GitHubIcon from '@mui/icons-material/GitHub';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Suspense } from 'react';
import { twJoin } from 'tailwind-merge';

import { githubUrl } from '#/constants/githubUrl';
import { useUserContext } from '#/hooks/use-user-context';

import { MobileNavMenu } from '../NavMenu/components/MobileNavMenu';
import { Popover } from '../Popover';
import { SimpleErrorBoundary } from '../SimpleErrorBoundary';
import { SiteNavMenu, useSiteNavMenuItems } from './components/SiteNavMenu';
import { ThemeToggles } from './components/SiteNavMenu/components/ThemeToggles';

type PageWrapperPropsDef = PropsWithChildren<{
  title?: string;
  wideOnMobile?: boolean;
}>;

export const PageWrapper = (props: PageWrapperPropsDef) => {
  const { children, title = 'Collection Tracker', wideOnMobile } = props;

  const { accountNavItems, primaryNavItems } = useSiteNavMenuItems();

  const mobileAccountNavItems = accountNavItems.reduce<
    {
      href: string | undefined;
      label: string | undefined;
    }[]
  >((acc, { href, items, label }) => {
    if (items?.length) {
      const formattedSubItems = items.map(({ href, label }) => {
        return { href, label };
      });

      return [...acc, { href, label }, ...formattedSubItems];
    } else {
      return [...acc, { href, label }];
    }
  }, []);

  const user = useUserContext();

  return (
    <div className="p-1 md:p-4 h-dvh overflow-hidden size-full grid grid-rows-[auto_1fr] gap-2 md:gap-4">
      <header className="grid gap-2 md:gap-4">
        <div className="py-1 md:py-0 flex items-center gap-2 justify-between text-white">
          <div className="flex items-center gap-2">
            <MobileNavMenu
              BottomContent={({ closeMenu }) => {
                return (
                  <div className="px-10 flex items-center justify-between gap-10">
                    {mobileAccountNavItems.map(({ href, label }) => {
                      return (
                        <Link
                          className="px-3 py-1 text-inherit"
                          key={label}
                          onClick={closeMenu}
                          to={href}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                );
              }}
              items={primaryNavItems}
              TopContent={ThemeToggles}
            />

            <Link className="flex items-center gap-2 text-inherit" to="/">
              <div className="hidden md:block">
                <ListAltIcon
                  className="text-4xl text-inherit"
                  fontSize="large"
                />
              </div>
            </Link>

            <Link
              className="flex items-center gap-2 text-inherit"
              to={user?.id ? '/collections' : '/'}
            >
              <h1 className="text-inherit text-2xl md:text-3xl">{title}</h1>
            </Link>
          </div>

          <div className="flex gap-2 md:gap-4">
            <Popover
              aria-label="Buy me a coffee"
              Description="Buy me a coffee!"
              Trigger={() => {
                return (
                  <a
                    aria-label="Buy me a coffee"
                    className="text-white hover:text-primary-300 dark:hover:text-theme-link-hover"
                    href="https://buymeacoffee.com/jack.dark"
                    target="_blank"
                  >
                    <CoffeeIcon />
                  </a>
                );
              }}
            />

            <Popover
              aria-label="View GitHub"
              Description="This project is open source!"
              Trigger={() => {
                return (
                  <a
                    aria-label="View GitHub"
                    className="text-white hover:text-primary-300 dark:hover:text-theme-link-hover"
                    href={githubUrl.repo}
                    target="_blank"
                  >
                    <GitHubIcon />
                  </a>
                );
              }}
            />
          </div>
        </div>

        <QueryErrorResetBoundary>
          {({ reset }) => {
            return (
              <SimpleErrorBoundary onReset={reset}>
                <Suspense>
                  <SiteNavMenu />
                </Suspense>
              </SimpleErrorBoundary>
            );
          }}
        </QueryErrorResetBoundary>
      </header>

      <main
        className={twJoin(
          'relative size-full',
          wideOnMobile ? 'p-2' : 'p-4',
          'md:p-4 md:pt-6',
          'bg-theme-surface-1 rounded-xs',
        )}
      >
        <QueryErrorResetBoundary>
          {({ reset }) => {
            return (
              <SimpleErrorBoundary onReset={reset}>
                <Suspense fallback="Loading...">
                  <div className="size-full relative top-0 right-0 bottom-0 left-0">
                    <div className="size-full absolute top-0 right-0 bottom-0 left-0">
                      {children}
                    </div>
                  </div>
                </Suspense>
              </SimpleErrorBoundary>
            );
          }}
        </QueryErrorResetBoundary>
      </main>
    </div>
  );
};
