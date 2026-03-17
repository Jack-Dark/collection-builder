import { Menu } from '@base-ui/react';
import { Link } from '@tanstack/react-router';
import { getCursorClassName } from '#/helpers';
import { Fragment } from 'react';

import type { MoreMenuPropsDef } from '../../MoreMenu.types';

import { ConditionalWrapper } from '../../../ConditionalWrapper';
import { ArrowSvg } from './components/ArrowSvg';
import { MenuItemLabel } from './components/MenuItemLabel';

export const MenuList = (props: MoreMenuPropsDef) => {
  const {
    align = 'center',
    alignOffset,
    items,
    side = 'bottom',
    sideOffset = 8,
  } = props;

  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        className="outline-hidden"
        side={side}
        sideOffset={sideOffset}
      >
        <Menu.Popup className="origin-(--transform-origin) rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
          <Menu.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
            <ArrowSvg />
          </Menu.Arrow>

          {items.map((itemProps) => {
            const {
              addSeparator,
              disabled,
              href,
              key,
              label,
              onClick,
              subMenu,
              target,
            } = itemProps;

            const menuItemClasses = `flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-hidden select-none ${getCursorClassName(disabled)} ${disabled ? 'text-gray-400' : 'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-xs data-[highlighted]:before:bg-primary-50'}`;

            return (
              <Fragment key={typeof label === 'string' ? label : key}>
                {subMenu?.items?.length ? (
                  <Menu.SubmenuRoot
                    disabled={subMenu?.disabled}
                    open={subMenu?.open && !subMenu?.disabled}
                  >
                    <Menu.SubmenuTrigger
                      className={menuItemClasses}
                      disabled={disabled}
                    >
                      <ConditionalWrapper
                        condition={!!href && !disabled}
                        Wrapper={({ children }) => {
                          return (
                            <Link target={target} to={href!}>
                              {children}
                            </Link>
                          );
                        }}
                      >
                        <MenuItemLabel label={label} />
                      </ConditionalWrapper>
                    </Menu.SubmenuTrigger>
                    <MenuList
                      {...subMenu}
                      align={
                        !subMenu.align && subMenu?.items?.length > 1
                          ? 'start'
                          : subMenu.align
                      }
                      side={subMenu.side || 'left'}
                    />
                  </Menu.SubmenuRoot>
                ) : (
                  <Menu.Item
                    className={menuItemClasses}
                    onClick={disabled ? undefined : onClick}
                  >
                    <ConditionalWrapper
                      condition={!!href && !disabled}
                      Wrapper={({ children }) => {
                        return (
                          <Link target={target} to={href!}>
                            {children}
                          </Link>
                        );
                      }}
                    >
                      <MenuItemLabel label={label} />
                    </ConditionalWrapper>
                  </Menu.Item>
                )}
                {addSeparator && (
                  <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" />
                )}
              </Fragment>
            );
          })}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
};
