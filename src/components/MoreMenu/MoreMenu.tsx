import type { JSXElementConstructor } from 'react';

import { Menu } from '@base-ui/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from '@tanstack/react-router';

import type {
  MoreMenuPropsDef,
  MoreMenuSubMenuPropsDef,
} from './MoreMenu.types';

export const MoreMenu = (props: MoreMenuPropsDef) => {
  const {
    align = 'center',
    alignOffset,
    disabled: disabledMenu,
    items,
    open,
    side = 'bottom',
    sideOffset = 8,
  } = props;

  return (
    <Menu.Root disabled={disabledMenu} open={open}>
      <Menu.Trigger
        className="flex items-center justify-center select-none cursor-pointer"
        disabled={disabledMenu}
      >
        <MoreHorizIcon />
      </Menu.Trigger>
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

            {items.map(
              ({
                addSeparator,
                disabled,
                href,
                label,
                onClick,
                subMenu,
                target,
              }) => {
                return (
                  <>
                    <Menu.Item
                      className={`flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-hidden select-none ${disabled ? 'text-gray-400 cursor-not-allowed' : 'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-xs data-[highlighted]:before:bg-primary-50 cursor-pointer'}`}
                      onClick={disabled ? undefined : onClick}
                    >
                      {href && !disabled ? (
                        <Link target={target} to={href}>
                          <ItemLabel label={label} />
                        </Link>
                      ) : (
                        <ItemLabel label={label} />
                      )}
                    </Menu.Item>
                    {!!subMenu?.items?.length && (
                      <Menu.SubmenuRoot>
                        <Menu.SubmenuTrigger disabled={disabled} />
                        <Menu.Portal>
                          <Menu.Positioner>
                            <Menu.Popup>{/* Submenu items  */}</Menu.Popup>
                          </Menu.Positioner>
                        </Menu.Portal>
                      </Menu.SubmenuRoot>
                    )}
                    {addSeparator && (
                      <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" />
                    )}
                  </>
                );
              },
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const MenuList = (props: MoreMenuSubMenuPropsDef) => {
  const {
    align,
    alignOffset,
    disabled: disabledMenu,
    items,
    side,
    sideOffset,
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

          {items.map(
            ({
              addSeparator,
              disabled,
              href,
              label,
              onClick,
              subMenu,
              target,
            }) => {
              return (
                <>
                  <Menu.Item
                    className={`flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-hidden select-none ${disabled ? 'text-gray-400 cursor-not-allowed' : 'data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-xs data-[highlighted]:before:bg-primary-50 cursor-pointer'}`}
                    onClick={disabled ? undefined : onClick}
                  >
                    {href && !disabled ? (
                      <Link target={target} to={href}>
                        <ItemLabel label={label} />
                      </Link>
                    ) : (
                      <ItemLabel label={label} />
                    )}
                  </Menu.Item>
                  {!!subMenu?.items?.length && (
                    <Menu.SubmenuRoot>
                      <Menu.SubmenuTrigger disabled={subMenu.disabled} />

                      <MenuList {...subMenu} />
                      {/* <Menu.Portal>
                        <Menu.Positioner>
                          <Menu.Popup>
                            Submenu items 

                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal> */}
                    </Menu.SubmenuRoot>
                  )}
                  {addSeparator && (
                    <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" />
                  )}
                </>
              );
            },
          )}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
};

const ItemLabel = ({
  label,
}: {
  label: string | JSXElementConstructor<{}>;
}) => {
  return typeof label === 'string' ? label : <label />;
};

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="none" height="10" viewBox="0 0 20 10" width="20" {...props}>
      <path
        className="fill-[canvas]"
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
      />
      <path
        className="fill-gray-200 dark:fill-none"
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
      />
      <path
        className="dark:fill-gray-300"
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
      />
    </svg>
  );
}
