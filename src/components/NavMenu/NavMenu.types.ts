import type { RouterPath } from '#/types';
import type { JSXElementConstructor } from 'react';

export type NavMenuItem = (
  | {
      href: RouterPath | string;
      items?: never;
    }
  | {
      href?: never;
      items: NavMenuItem[];
    }
  | {
      href?: RouterPath | string;
      items: NavMenuItem[];
    }
) & {
  label: string;
  Icon?: JSXElementConstructor<{}>;
};
