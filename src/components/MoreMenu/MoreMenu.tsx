import { Menu } from '@base-ui/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { twJoin } from 'tailwind-merge';

import { getCursorClassName } from '#/helpers';

import type { MenuPropsDef } from './MoreMenu.types';

import { MenuList } from './components/MenuList';

export const MoreMenu = (props: MenuPropsDef) => {
  const { disabled, Icon = MoreHorizIcon, open, ...menuListProps } = props;

  return (
    <Menu.Root disabled={disabled} open={open}>
      <Menu.Trigger
        aria-label="Actions menu"
        className={twJoin(
          `flex items-center justify-center select-none`,
          getCursorClassName(disabled),
          disabled && 'text-disabled',
        )}
        disabled={disabled}
      >
        <Icon />
      </Menu.Trigger>
      <MenuList {...menuListProps} />
    </Menu.Root>
  );
};
