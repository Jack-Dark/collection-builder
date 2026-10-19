import type { PropsWithChildren } from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import { Popover } from '../Popover';
import { SimpleErrorBoundary } from '../SimpleErrorBoundary';
import { SiteNavMenu } from './components/SiteNavMenu';

type PageWrapperPropsDef = PropsWithChildren<{
  title: string;
}>;

export const PageWrapper = (props: PageWrapperPropsDef) => {
  const { children, title } = props;

  return (
    <>
      <header className="grid gap-4">
        <div className="flex items-center gap-2 justify-between text-white">
          <div className="flex items-center gap-2">
            <ListAltIcon className="text-4xl" fontSize="large" />
            <h1 className="text-inherit">{title}</h1>
          </div>

          <Popover
            Description="This project is open source!"
            Trigger={() => {
              return (
                <a
                  className="text-white hover:text-primary-300 dark:hover:text-theme-link-hover"
                  href="https://github.com/Jack-Dark/collection-tracker"
                  target="_blank"
                >
                  <GitHubIcon />
                </a>
              );
            }}
          />
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
    </>
  );
};
