import type { MenuPositionerProps } from '@base-ui/react';
import type { LinkProps } from '@tanstack/react-router';
import type { JSXElementConstructor, Key } from 'react';

export type MenuPropsDef = Pick<
  MenuPositionerProps,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
> & {
  disabled?: boolean;
  items: MenuItemDef[];
  open?: boolean;
};

export type MenuItemDef = {
  addSeparator?: boolean;
  disabled?: boolean;
} & MenuItemLabelPropsDef &
  (
    | (MenuItemBehaviorPropsDef & {
        group?: never;
        subMenu?: never;
      })
    | (MenuItemBehaviorPropsDef & {
        group?: never;
        subMenu?: MenuPropsDef;
      })
    | {
        group?: MenuItemGroupItemPropsDef[];
        href?: never;
        onClick?: never;
        subMenu?: never;
        target?: never;
      }
  );

type MenuItemLabelPropsDef =
  | {
      id?: never;
      label: string;
    }
  | {
      id: Key;
      label: JSXElementConstructor<{}>;
    };

type MenuItemBehaviorPropsDef =
  | {
      href: LinkProps['to'];
      onClick?: never;
      target?: string;
    }
  | {
      href?: never;
      onClick: () => void | Promise<void>;
      target?: never;
    };

type MenuItemGroupItemPropsDef = Omit<MenuItemDef, 'subMenu' | 'group'>;
