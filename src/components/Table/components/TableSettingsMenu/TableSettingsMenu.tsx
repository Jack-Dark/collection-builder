import SettingsIcon from '@mui/icons-material/Settings';

import { MoreMenu } from '#/components/MoreMenu';

import type { TableSettingsMenuPropsDef } from './TableSettingsMenu.types';

export const TableSettingsMenu = (props: TableSettingsMenuPropsDef) => {
  const { items } = props;

  const hasItems = !!items.filter(({ hidden }) => {
    return !hidden;
  }).length;

  return hasItems ? (
    <div className="size-full flex items-center justify-center hover:text-theme-link-hover">
      <MoreMenu
        Icon={() => {
          return <SettingsIcon fontSize="inherit" />;
        }}
        items={items}
      />
    </div>
  ) : null;
};
