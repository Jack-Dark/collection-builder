import { NavigationMenu } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import type { NavMenuItem } from './NavMenu.types';

import { ConditionalWrapper } from '../ConditionalWrapper';
import { MenuArrowSvg } from '../MoreMenu/components/MenuList/components/MenuArrowSvg';
import { NavigationLinkWrapper } from './components/NavigationLinkWrapper';

export const NavMenu = (props: { items: NavMenuItem[] }) => {
  const { items } = props;

  return (
    <NavigationMenu.Root className="min-w-max rounded-lg bg-gray-50 p-1 text-gray-900">
      <NavigationMenu.List className="relative flex items-center gap-2">
        {items.map(({ hidden, href, Icon, items, label, onClick }) => {
          const hasSubMenu = !!items?.filter(({ hidden }) => {
            return !hidden;
          })?.length;

          return hidden ? null : (
            <NavigationMenu.Item
              className={
                (hasSubMenu ? '' : 'px-3 py-2 ') +
                'rounded-md no-underline text-inherit ' +
                'hover:bg-btn-hover hover:text-white ' +
                'data-[status="active"]:bg-btn hover:data-[status="active"]:bg-btn-hover data-[status="active"]:text-white'
              }
              key={href || label}
              onClick={onClick}
            >
              <ConditionalWrapper
                condition={hasSubMenu}
                Wrapper={({ children }) => {
                  return (
                    <NavigationMenu.Trigger
                      className={
                        'px-3 py-2 ' +
                        'flex items-center justify-center gap-1.5 ' +
                        'rounded-md bg-inherit text-inherit font-medium ' +
                        'text-[0.925rem] [@media(min-width:32rem)]:text-base leading-6 select-none no-underline '
                      }
                    >
                      {children}
                      {items && (
                        <NavigationMenu.Icon className="transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180">
                          <ExpandMoreIcon />
                        </NavigationMenu.Icon>
                      )}
                    </NavigationMenu.Trigger>
                  );
                }}
              >
                <ConditionalWrapper
                  condition={!!href}
                  Wrapper={({ children }) => {
                    return (
                      <NavigationLinkWrapper href={href}>
                        {children}
                      </NavigationLinkWrapper>
                    );
                  }}
                >
                  <div className="flex items-center justify-center  gap-1.5">
                    {Icon && <Icon />}
                    {label}
                  </div>
                </ConditionalWrapper>
              </ConditionalWrapper>

              {hasSubMenu && (
                <NavigationMenu.Content
                  className={
                    'px-3 py-2 ' +
                    'min-w-40 ' +
                    'transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] ' +
                    'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ' +
                    'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] ' +
                    'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] ' +
                    'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] ' +
                    'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]'
                  }
                  keepMounted
                >
                  <ul className="grid list-none grid-cols-1 gap-2">
                    {items?.map(({ hidden, href, items, label, onClick }) => {
                      // TODO - UPDATE TO SUPPORT NESTED SUBMENUS
                      return hidden ? null : (
                        <li key={href || label}>
                          <NavigationLinkWrapper
                            className="text-black hover:text-btn-hover"
                            href={href}
                            onClick={onClick}
                          >
                            {label}
                          </NavigationLinkWrapper>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenu.Content>
              )}
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <NavigationMenu.Portal keepMounted>
        <NavigationMenu.Positioner
          className="box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[var(--duration)] ease-[var(--easing)] before:absolute before:content-[''] data-[instant]:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
          collisionAvoidance={{ side: 'none' }}
          collisionPadding={{ bottom: 5, left: 20, right: 20, top: 5 }}
          sideOffset={10}
          style={{
            ['--duration' as string]: '0.35s',
            ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] relative h-[var(--popup-height)] origin-[var(--transform-origin)] rounded-lg bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[opacity,transform,width,height,scale,translate] duration-[var(--duration)] ease-[var(--easing)] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 w-[var(--popup-width)] dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <NavigationMenu.Arrow className="flex transition-[left] duration-[var(--duration)] ease-[var(--easing)] data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <MenuArrowSvg />
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
