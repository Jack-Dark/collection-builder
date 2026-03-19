import type { RouterPath } from '#/types';
import type { JSXElementConstructor, MouseEventHandler } from 'react';

export type NavMenuItem = {
  label: string;
  Icon?: JSXElementConstructor<{}>;
  hidden?: boolean;
  href: RouterPath | string;
  items?: NavMenuItem[];
  onClick?: MouseEventHandler<HTMLElement>;
};
