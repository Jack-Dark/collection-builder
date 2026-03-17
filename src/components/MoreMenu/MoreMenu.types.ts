import type { MenuPositionerProps } from '@base-ui/react';
import type { JSXElementConstructor } from 'react';

export type MoreMenuPropsDef = Pick<
  MenuPositionerProps,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
> & {
  items: MoreMenuItemDef[];
  disabled?: boolean;
  open?: boolean;
};

export type MoreMenuItemDef = {
  label: string | JSXElementConstructor<{}>;
  addSeparator?: boolean;
  subMenu?: MoreMenuSubMenuPropsDef;
  disabled?: boolean;
} & (
  | {
      href: string;
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
