import type { MenuPositionerProps } from '@base-ui/react';
import type { RouterPath } from '#/types';
import type { JSXElementConstructor, Key } from 'react';

export type MoreMenuPropsDef = Pick<
  MenuPositionerProps,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
> & {
  items: MoreMenuItemDef[];
  disabled?: boolean;
  open?: boolean;
};

export type MoreMenuItemDef = {
  addSeparator?: boolean;
  subMenu?: MoreMenuPropsDef;
  disabled?: boolean;
} & (
  | {
      label: string;
      key?: never;
    }
  | {
      label: JSXElementConstructor<{}>;
      key: Key;
    }
) &
  (
    | {
        href: RouterPath;
        target?: string;
        onClick?: never;
      }
    | {
        href?: never;
        target?: never;
        onClick: () => void | Promise<void>;
      }
  );

export type MoreMenuSubMenuPropsDef = Omit<MoreMenuPropsDef, 'open'>;
