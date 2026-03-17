import { Menu } from '@base-ui/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import type { MoreMenuPropsDef } from './MoreMenu.types';

import { MenuList } from './components/MenuList';

export const MoreMenu = (props: MoreMenuPropsDef) => {
  const { disabled: disabledMenu, open, ...rest } = props;

  return (
    <Menu.Root disabled={disabledMenu} open={open}>
      <Menu.Trigger
        className="flex items-center justify-center select-none cursor-pointer"
        disabled={disabledMenu}
      >
        <MoreHorizIcon />
      </Menu.Trigger>
      <MenuList {...rest} />
    </Menu.Root>
  );
};
