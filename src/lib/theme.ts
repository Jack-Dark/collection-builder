import { createClientOnlyFn, createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import * as z from 'zod';

export const userPreferenceThemes = {
  dark: 'dark',
  light: 'light',
} as const;

const userThemeSchema = z
  .union([
    z.literal(userPreferenceThemes.light),
    z.literal(userPreferenceThemes.dark),
  ])
  .describe('User Theme');

export type UserPreferencesThemeDef = z.output<typeof userThemeSchema>;

const userThemeCookieKey = '_theme-preference';

export const getThemeServerFn = createServerFn().handler(async () => {
  const themeCookieValue = getCookie(userThemeCookieKey);

  const { data } = userThemeSchema.safeParse(themeCookieValue);

  return data;
});

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .validator(userThemeSchema)
  .handler(async ({ data }) => {
    return setCookie(userThemeCookieKey, data);
  });

export const getSystemTheme = createClientOnlyFn(() => {
  const systemPrefersDarkMode = window?.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const systemTheme: UserPreferencesThemeDef = systemPrefersDarkMode
    ? userPreferenceThemes.dark
    : userPreferenceThemes.light;

  return systemTheme;
});
