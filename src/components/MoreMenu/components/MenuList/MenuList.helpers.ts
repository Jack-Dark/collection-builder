import { twJoin } from 'tailwind-merge';

import { getCursorClassName } from '#/helpers';

export const getMenuItemClasses = (props: {
  active: boolean | undefined;
  disabled: boolean | undefined;
}) => {
  const { active, disabled } = props;

  return twJoin(
    `py-2 px-4`,
    getCursorClassName(disabled),
    disabled && 'text-theme-disabled',
    // ? active styles
    active && 'bg-theme-surface-selected',
    // ? hover styles
    'data-highlighted:bg-theme-surface-highlighted',
  );
};
