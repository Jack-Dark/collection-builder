import { twJoin } from 'tailwind-merge';

import { getCursorClassName } from '#/helpers';

export const getMenuItemClasses = (disabled: boolean | undefined) => {
  return twJoin(
    `py-2 px-4`,
    getCursorClassName(disabled),
    disabled && 'text-theme-disabled',
    // ? hover styles
    'data-highlighted:bg-theme-surface-highlighted',
  );
};
