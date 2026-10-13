import type { Preview } from '@storybook/tanstack-react';

import '../src/styles.css';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { useEffect } from 'react';

import { DialogProvider } from '#/components/Dialog/Dialog.Provider';

const preview: Preview = {
  decorators: [
    (Component) => {
      return (
        <DialogProvider>
          <Component />
        </DialogProvider>
      );
    },
    withThemeByDataAttribute({
      attributeName: 'data-theme',
      defaultTheme: 'light',
      themes: {
        dark: 'dark',
        light: 'light',
      },
    }),
    (storyFn) => {
      useEffect(() => {
        document.documentElement.classList.add('bg-white', 'dark:bg-zinc-900');
      }, []);

      return storyFn();
    },
  ],
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
};

export default preview;
