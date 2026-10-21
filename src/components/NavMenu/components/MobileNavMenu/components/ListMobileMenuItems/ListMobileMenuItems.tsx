import type { MouseEvent } from 'react';

import { NavigationMenu } from '@base-ui/react';
import { twJoin } from 'tailwind-merge';

import type { ListMobileMenuItemsPropsDef } from './ListMobileMenuItems.types';

import { NavigationLinkWrapper } from '../../../NavigationLinkWrapper';

export const ListMobileMenuItems = (props: ListMobileMenuItemsPropsDef) => {
  const { className, closeMenu, items = [] } = props;

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className={twJoin('list-none', className)}>
        {items?.map(
          ({ hidden, href, items, label, onClick, RenderItem }, index) => {
            const hasSubMenu = !!items?.some(({ hidden }) => {
              return !hidden;
            });

            const handleOnClick = (e: MouseEvent<HTMLElement>) => {
              closeMenu();

              onClick?.(e);
            };

            return hidden ? null : (
              <NavigationMenu.Item key={href || label || index}>
                {RenderItem ? (
                  <div
                    className={twJoin(!href && 'px-3 py-2')}
                    onClick={handleOnClick}
                  >
                    <RenderItem />
                  </div>
                ) : (
                  <div
                    className={twJoin(
                      // ? standard styles
                      'block text-theme-t1',
                      // ? active status styles
                      'data-[status="active"]:bg-theme-surface-selected',
                      // ? hover styles
                      'hover:bg-theme-surface-highlighted',
                      'hover:data-[status="active"]:bg-theme-surface-highlighted',
                    )}
                    onClick={handleOnClick}
                  >
                    <NavigationLinkWrapper
                      className="px-3 py-1 text-inherit"
                      href={href}
                      onClick={handleOnClick}
                    >
                      {label}
                    </NavigationLinkWrapper>
                  </div>
                )}
                {hasSubMenu && (
                  <ListMobileMenuItems
                    className="pl-4"
                    closeMenu={closeMenu}
                    items={items}
                  />
                )}
              </NavigationMenu.Item>
            );
          },
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
