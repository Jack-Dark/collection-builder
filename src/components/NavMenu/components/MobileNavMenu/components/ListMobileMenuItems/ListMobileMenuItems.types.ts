import type { NavMenuItem } from '#/components/NavMenu/NavMenu.types';

export type ListMobileMenuItemsPropsDef = {
  className?: string;
  closeMenu: () => void;
  items: NavMenuItem[] | undefined;
};
