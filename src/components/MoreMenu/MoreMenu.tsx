import { Menu } from '@base-ui/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getCursorClassName } from '#/helpers';

import type { MenuPropsDef } from './MoreMenu.types';

import { MenuList } from './components/MenuList';

export const MoreMenu = (props: MenuPropsDef) => {
  const { disabled: disabled, open, ...rest } = props;

  return (
    <Menu.Root disabled={disabled} open={open}>
      <Menu.Trigger
        className={`flex items-center justify-center select-none ${getCursorClassName(disabled)}`}
        disabled={disabled}
      >
        <MoreHorizIcon />
      </Menu.Trigger>
      <MenuList {...rest} />
    </Menu.Root>
  );
};
