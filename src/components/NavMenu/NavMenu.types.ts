import type { JSXElementConstructor, MouseEventHandler } from 'react';

import type { RouterPath } from '#/types';

export type NavMenuItem = {
  hidden?: boolean;
  href: RouterPath | string;
  Icon?: JSXElementConstructor<{}>;
  items?: NavMenuItem[];
  label: string;
  onClick?: MouseEventHandler<HTMLElement>;
};
