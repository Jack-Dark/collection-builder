import type { RouteComponent } from '@tanstack/react-router';

import { Toggle, ToggleGroup } from '@base-ui/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Outlet, useRouter } from '@tanstack/react-router';
import { createClientOnlyFn } from '@tanstack/react-start';
import { Suspense, useEffect, useState } from 'react';

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
  return (
    <SimpleErrorBoundary>
      <FullPageLoadingSpinner />
      <Notifications />
      <div className="p-4 h-dvh overflow-hidden size-full grid grid-rows-[auto_1fr] gap-4">
        <header className="grid gap-4">
          <div className="flex items-center gap-2 text-t-1">
            <ListAltIcon className="text-inherit text-4xl" fontSize="large" />
            <h1 className="text-inherit">Start tracking your collections!</h1>
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

        <main className="size-full px-4 pt-6 pb-4 bg-surface-1 text-t-1 rounded-xs">
          <QueryErrorResetBoundary>
            {({ reset }) => {
              return (
                <SimpleErrorBoundary onReset={reset}>
                  <Suspense fallback="Loading...">
                    <Outlet />
                  </Suspense>
                </SimpleErrorBoundary>
              );
            }}
          </QueryErrorResetBoundary>
        </main>

        {/* <footer className="grid p-4">PLACEHOLDER FOOTER CONTENT</footer> */}
      </div>
    </SimpleErrorBoundary>
  );
};

const SiteNavMenu = () => {
  const { data } = useGetNavMenuCollections({
    placeholderData: {
      collections: [],
    },
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
          RenderItem: ThemeToggles,
        },
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

  return <NavMenu items={navItems} />;
};

const ThemeToggles = () => {
  const { setTheme, theme: userTheme } = useUserPreferences();

  const themeToggleItems = [
    {
      label: 'Light Mode',
      theme: userPreferenceThemes.light,
      ThemeIcon: LightModeIcon,
    },
    {
      label: 'Dark Mode',
      theme: userPreferenceThemes.dark,
      ThemeIcon: DarkModeIcon,
    },
  ] as const;

  return (
    <div className="grid gap-1 py-2">
      <p>Theme</p>
      <ToggleGroup
        aria-label="User Theme"
        className="grid gap-1 grid-cols-3"
        defaultValue={[userPreferenceThemes.dark]}
      >
        {themeToggleItems.map(({ label, theme, ThemeIcon }) => {
          const isSelected = theme === userTheme;

          return (
            <Toggle aria-label={label} key={theme} value={theme}>
              <div
                className={`border rounded-sm ${isSelected ? '' : ''}`}
                onClick={() => {
                  setTheme(theme);
                }}
              >
                <ThemeIcon />
              </div>
            </Toggle>
          );
        })}
      </ToggleGroup>
    </div>
  );
};

const userPreferenceThemes = {
  dark: 'dark',
  light: 'light',
} as const;

type UserPreferencesThemeDef =
  (typeof userPreferenceThemes)[keyof typeof userPreferenceThemes];

const systemPreferencesKeys = {
  ignoreSortArticles: 'ignore-sort-articles',
  theme: 'ui-theme',
} as const;

const getLocalStorageTheme = createClientOnlyFn(() => {
  const localStorageTheme = localStorage.getItem(
    systemPreferencesKeys.theme,
  ) as UserPreferencesThemeDef | null;

  return localStorageTheme ?? userPreferenceThemes.light;
});

const setLocalStorageTheme = createClientOnlyFn(
  (theme: UserPreferencesThemeDef) => {
    return localStorage.setItem(systemPreferencesKeys.theme, theme);
  },
);

const getLocalStorageIgnoreSortArticles = createClientOnlyFn(() => {
  const localStorageValue = localStorage.getItem(
    systemPreferencesKeys.ignoreSortArticles,
  ) as 'true' | 'false' | null;

  if (localStorageValue) {
    return localStorageValue === 'true' ? true : false;
  } else {
    return true;
  }
});

const setLocalStorageIgnoreSortArticles = createClientOnlyFn(
  (ignoreSortArticles: boolean) => {
    return localStorage.setItem(
      systemPreferencesKeys.ignoreSortArticles,
      String(ignoreSortArticles),
    );
  },
);

export const useUserPreferences = () => {
  const [theme, setTheme] = useState<UserPreferencesThemeDef>(
    userPreferenceThemes.dark,
  );
  const [ignoreSortArticles, setIgnoreSortArticles] = useState<boolean>(true);

  const handleSetTheme = createClientOnlyFn(
    (theme: UserPreferencesThemeDef) => {
      setLocalStorageTheme(theme);
      setTheme(theme);
    },
  );
  const handleSetIgnoreSortArticles = createClientOnlyFn(
    (ignoreSortArticles: boolean) => {
      setLocalStorageIgnoreSortArticles(ignoreSortArticles);
      setIgnoreSortArticles(ignoreSortArticles);
    },
  );

  useEffect(() => {
    const systemPrefersDarkMode = window?.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const systemTheme: UserPreferencesThemeDef = systemPrefersDarkMode
      ? userPreferenceThemes.dark
      : userPreferenceThemes.light;

    const localStorageTheme = getLocalStorageTheme();

    if (localStorageTheme) {
      setTheme(localStorageTheme);
    } else {
      handleSetTheme(systemTheme);
    }

    const localStorageIgnoreSortArticles = getLocalStorageIgnoreSortArticles();

    if (localStorageTheme) {
      setIgnoreSortArticles(localStorageIgnoreSortArticles);
    } else {
      handleSetIgnoreSortArticles(localStorageIgnoreSortArticles);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return {
    ignoreSortArticles,
    setIgnoreSortArticles: handleSetIgnoreSortArticles,
    setTheme: handleSetTheme,
    theme,
  };
};
