import type { PropsWithChildren } from 'react';

import { useRouter } from '@tanstack/react-router';
import { createContext, use } from 'react';

import type { UserPreferencesThemeDef } from '#/lib/theme';

import { setThemeServerFn } from '#/lib/theme';

type ThemeContextVal = {
  setTheme: (theme: UserPreferencesThemeDef) => void;
  theme: UserPreferencesThemeDef | undefined;
};

const ThemeContext = createContext<ThemeContextVal | null>(null);

type ThemeProviderPropsDef = PropsWithChildren<{
  theme: UserPreferencesThemeDef | undefined;
}>;

export const ThemeProvider = ({ children, theme }: ThemeProviderPropsDef) => {
  const router = useRouter();

  const setTheme = async (theme: UserPreferencesThemeDef) => {
    await setThemeServerFn({ data: theme }).then(() => {
      return router.invalidate();
    });
  };

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>;
};

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme called outside of ThemeProvider!');

  return context;
};
