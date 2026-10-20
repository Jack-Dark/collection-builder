import type { PropsWithChildren } from 'react';

import CoffeeIcon from '@mui/icons-material/Coffee';
import GitHubIcon from '@mui/icons-material/GitHub';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import { Popover } from '../Popover';
import { githubUrl, SimpleErrorBoundary } from '../SimpleErrorBoundary';
import { SiteNavMenu } from './components/SiteNavMenu';

type PageWrapperPropsDef = PropsWithChildren<{
  title: string;
}>;

export const PageWrapper = (props: PageWrapperPropsDef) => {
  const { children, title } = props;

  return (
    <div className="p-4 h-dvh overflow-hidden size-full grid grid-rows-[auto_1fr] gap-4">
      <header className="grid gap-4">
        <div className="flex items-center gap-2 justify-between text-white">
          <Link className="flex items-center gap-2 text-inherit" to="/">
            <ListAltIcon className="text-4xl text-inherit" fontSize="large" />
            <h1 className="text-inherit">{title}</h1>
          </Link>

          <div className="flex gap-4 px-10">
            <Popover
              Description="Buy us a coffee!"
              Trigger={() => {
                return (
                  <a
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
              Description="This project is open source!"
              Trigger={() => {
                return (
                  <a
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

      <main className="relative size-full px-4 pt-6 pb-4 bg-theme-surface-1 rounded-xs">
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

      {/* <footer className="grid p-4">PLACEHOLDER FOOTER CONTENT</footer> */}
    </div>
  );
};
