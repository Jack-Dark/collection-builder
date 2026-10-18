import { Toggle, ToggleGroup } from '@base-ui/react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useEffect } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import {
  getSystemTheme,
  userPreferenceThemes,
} from '../../../../../../lib/theme';
import { useTheme } from '../../../../../ThemeProvider';

export const ThemeToggles = () => {
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
    <ToggleGroup
      aria-label="User Theme"
      className="grid gap-1 grid-cols-2 border border-theme-divider-2 rounded-4xl bg-theme-surface-2 p-1 w-full"
      defaultValue={[userPreferenceThemes.dark]}
    >
      {themeToggleItems.map(({ label, theme, ThemeIcon }) => {
        return (
          <Toggle
            aria-label={label}
            className={twJoin(
              `p-0.5 flex items-center justify-center rounded-4xl cursor-pointer`,
              theme === userPreferenceThemes.light
                ? // ? light mode toggle
                  twMerge(
                    // ? viewed in light mode (selected)
                    'light:bg-amber-300 light:text-amber-600',

                    // ? viewed in dark mode
                    'dark:bg-amber-200/10 dark:text-amber-300',
                    'dark:hover:bg-amber-300 dark:hover:text-amber-600',
                  )
                : // ? dark mode toggle
                  twMerge(
                    // ? viewed in light mode
                    'light:bg-primary-800/20',
                    'light:hover:bg-primary-800 light:hover:text-white',

                    // ? viewed in dark mode (selected)
                    'dark:bg-primary-800 dark:hover:text-white',
                  ),
            )}
            key={theme}
            onClick={() => {
              setTheme(theme);
            }}
            value={theme}
          >
            <ThemeIcon className="inherit" fontSize="small" />
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
};
