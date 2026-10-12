import { Toggle, ToggleGroup } from '@base-ui/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

import type { RouterPath } from '../../../../types';
import type { NavMenuItem } from '../../../NavMenu/NavMenu.types';

import { useGetNavMenuCollections } from '../../../../api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { authClient } from '../../../../auth/auth-client';
import { getSystemTheme, userPreferenceThemes } from '../../../../lib/theme';
import { Route as CollectionsRoute } from '../../../../routes/_protected/collections';
import { Route as CollectionRoute } from '../../../../routes/_protected/collections/$id';
import { NavMenu } from '../../../NavMenu';
import { useTheme } from '../../../ThemeProvider';

export const SiteNavMenu = () => {
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
  const { setTheme, theme: userTheme } = useTheme();

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

  useEffect(() => {
    if (!userTheme) {
      const theme = getSystemTheme();

      setTheme(theme);
    }
  }, []);

  return (
    <div className="px-3 py-2 grid gap-1">
      <p>Theme</p>
      <ToggleGroup
        aria-label="User Theme"
        className="grid gap-1 grid-cols-2 border rounded-4xl bg-theme-surface-2 p-1"
        defaultValue={[userPreferenceThemes.dark]}
      >
        {themeToggleItems.map(({ label, theme, ThemeIcon }) => {
          const isSelected = theme === userTheme;

          return (
            <Toggle
              aria-label={label}
              className={`p-1 rounded-4xl cursor-pointer ${isSelected ? 'bg-theme-link' : 'hover:bg-theme-surface-3'}`}
              key={theme}
              onClick={() => {
                setTheme(theme);
              }}
              value={theme}
            >
              <ThemeIcon
                className={isSelected ? 'text-white' : 'dark:text-white'}
              />
            </Toggle>
          );
        })}
      </ToggleGroup>
    </div>
  );
};
