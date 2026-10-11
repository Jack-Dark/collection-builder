import type { JSXElementConstructor, MouseEventHandler } from 'react';

import type { RouterPath } from '#/types';

export type NavMenuItem = {
  hidden?: boolean;
  items?: NavMenuItem[];
  onClick?: MouseEventHandler<HTMLElement>;
} & (
  | {
      href: RouterPath | string;
      Icon?: JSXElementConstructor<{}>;
      label: string;
      RenderItem?: never;
    }
  | {
      href?: never;
      Icon?: never;
      label?: never;
      RenderItem: JSXElementConstructor<{}>;
    }
);
