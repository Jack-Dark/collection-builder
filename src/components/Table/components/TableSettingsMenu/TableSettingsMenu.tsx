import SettingsIcon from '@mui/icons-material/Settings';
import { twJoin } from 'tailwind-merge';

import { MoreMenu } from '#/components/MoreMenu';
import { Popover } from '#/components/Popover';

import type { TableSettingsMenuPropsDef } from './TableSettingsMenu.types';

export const TableSettingsMenu = (props: TableSettingsMenuPropsDef) => {
  const { items } = props;

  const hasItems = !!items.filter(({ hidden }) => {
    return !hidden;
  }).length;

  const hasActiveItems = items.some((item) => {
    return item.active;
  });

  return hasItems ? (
    <div
      className={twJoin(
        'size-full flex items-center justify-center',
        hasActiveItems ? 'text-theme-link' : 'text-inherit',
        'hover:text-theme-link-hover',
      )}
    >
      <MoreMenu
        Icon={() => {
          return (
            <Popover
              aria-label="Table settings"
              Description="Table settings"
              isTriggerButton
              Trigger={() => {
                return (
                  <div className="flex items-center justify-between size-full p-1">
                    <SettingsIcon
                      className="cursor-pointer"
                      fontSize="inherit"
                    />
                  </div>
                );
              }}
            />
          );
        }}
        items={items}
      />
    </div>
  ) : null;
};
