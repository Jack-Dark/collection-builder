import type { RouterPath } from '#/types';
import type { JSXElementConstructor, MouseEventHandler } from 'react';

export type NavMenuItem = {
  hidden?: boolean;
  href: RouterPath | string;
  Icon?: JSXElementConstructor<{}>;
  items?: NavMenuItem[];
  label: string;
  onClick?: MouseEventHandler<HTMLElement>;
};
