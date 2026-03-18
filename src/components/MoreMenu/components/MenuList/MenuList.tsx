import type { RouterPath } from '#/types';

import { Menu } from '@base-ui/react';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

import type { MenuPropsDef } from '../../MoreMenu.types';

import { ConditionalWrapper } from '../../../ConditionalWrapper';
import { MenuArrowSvg } from './components/MenuArrowSvg';
import { MenuItemLabel } from './components/MenuItemLabel';
import { getMenuItemClasses } from './MenuList.helpers';

export const MenuList = (props: MenuPropsDef) => {
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
            <MenuArrowSvg />
          </Menu.Arrow>

          {items.map((itemProps) => {
            const {
              addSeparator,
              disabled,
              group,
              href,
              id,
              label,
              onClick,
              subMenu,
              target,
            } = itemProps;

            return (
              <Fragment key={typeof label === 'string' ? label : id}>
                {group?.length ? (
                  <Menu.Group>
                    <Menu.GroupLabel
                      className={getMenuItemClasses(disabled)}
                      data-group-label=""
                    >
                      <MenuItemLabel label={label} />
                    </Menu.GroupLabel>

                    {group.map((groupProps) => {
                      const {
                        addSeparator,
                        disabled,
                        href,
                        id,
                        label,
                        onClick,
                        target,
                      } = groupProps;

                      return (
                        <Fragment key={typeof label === 'string' ? label : id}>
                          <Menu.Item
                            className={getMenuItemClasses(disabled)}
                            data-clickable={href || onClick ? '' : undefined}
                            data-disabled={disabled ? '' : undefined}
                            disabled={disabled}
                            onClick={disabled ? undefined : onClick}
                          >
                            <ConditionalWrapper
                              condition={!!href && !disabled}
                              Wrapper={({ children }) => {
                                return (
                                  <Link target={target} to={href as RouterPath}>
                                    {children}
                                  </Link>
                                );
                              }}
                            >
                              <MenuItemLabel label={label} />
                            </ConditionalWrapper>
                          </Menu.Item>
                          {addSeparator && (
                            <Menu.Separator className="mx-4 my-1.5 h-px bg-divider" />
                          )}
                        </Fragment>
                      );
                    })}
                  </Menu.Group>
                ) : subMenu?.items?.length ? (
                  <Menu.SubmenuRoot
                    disabled={subMenu?.disabled}
                    open={subMenu?.open && !subMenu?.disabled}
                  >
                    <Menu.SubmenuTrigger
                      className={getMenuItemClasses(disabled)}
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
                    className={getMenuItemClasses(disabled)}
                    data-clickable={href || onClick ? '' : undefined}
                    data-disabled={disabled ? '' : undefined}
                    disabled={disabled}
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
                  <Menu.Separator className="mx-4 my-1.5 h-px bg-divider" />
                )}
              </Fragment>
            );
          })}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
};
