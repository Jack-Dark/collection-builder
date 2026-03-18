import type { MenuPositionerProps } from '@base-ui/react';
import type { RouterPath } from '#/types';
import type { JSXElementConstructor, Key } from 'react';

export type MenuPropsDef = Pick<
  MenuPositionerProps,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
> & {
  items: MenuItemDef[];
  disabled?: boolean;
  open?: boolean;
};

export type MenuItemDef = {
  addSeparator?: boolean;
  disabled?: boolean;
} & MenuItemLabelPropsDef &
  (
    | (MenuItemBehaviorPropsDef & {
        subMenu?: never;
        group?: never;
      })
    | (MenuItemBehaviorPropsDef & {
        subMenu?: MenuPropsDef;
        group?: never;
      })
    | {
        href?: never;
        target?: never;
        onClick?: never;
        subMenu?: never;
        group?: MenuItemGroupItemPropsDef[];
      }
  );

type MenuItemLabelPropsDef =
  | {
      label: string;
      id?: never;
    }
  | {
      label: JSXElementConstructor<{}>;
      id: Key;
    };

type MenuItemBehaviorPropsDef =
  | {
      href: RouterPath;
      target?: string;
      onClick?: never;
    }
  | {
      href?: never;
      target?: never;
      onClick: () => void | Promise<void>;
    };

type MenuItemGroupItemPropsDef = Omit<MenuItemDef, 'subMenu' | 'group'>;
