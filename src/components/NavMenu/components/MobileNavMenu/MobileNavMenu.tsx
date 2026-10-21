import { Drawer } from '@base-ui/react/drawer';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useLayoutEffect, useState } from 'react';

import type { NavMenuItem } from '../../NavMenu.types';

import { ListMobileMenuItems } from './components/ListMobileMenuItems';

export const MobileNavMenu = (props: { items: NavMenuItem[] }) => {
  const { items } = props;

  const [open, setOpen] = useState<boolean>(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      const mobileBreakSize = 768;
      const viewportWidth = window.innerWidth;

      if (viewportWidth >= mobileBreakSize) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener('resize', handleResize);
    } else {
      window.removeEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  return (
    <Drawer.Root onOpenChange={setOpen} open={open} swipeDirection="left">
      <Drawer.Trigger className="flex justify-center items-center p-2 text-theme-t1 hover:text-theme-link-hover cursor-pointer">
        <MenuIcon aria-label="Menu" />
      </Drawer.Trigger>

      <Drawer.SwipeArea />

      <Drawer.Portal
        className="fixed block transition-transform transition-discrete duration-300"
        keepMounted
      >
        <Drawer.Backdrop className="[--backdrop-opacity:0.2] dark:[--backdrop-opacity:0.3] fixed inset-0 min-h-dvh min-w-dvw bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute" />
        <Drawer.Viewport className="fixed inset-0">
          <Drawer.Popup className="size-full max-w-80 bg-theme-surface-1 dark:bg-theme-surface-2 overflow-y-auto overscroll-contain touch-auto [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]">
            <div className="flex justify-end p-2">
              <Drawer.Close className="cursor-pointer p-1">
                <CloseIcon
                  aria-label="Close"
                  className="text-theme-t1 hover:text-theme-link-hover"
                />
              </Drawer.Close>
            </div>

            <Drawer.Content>
              <ListMobileMenuItems
                closeMenu={() => {
                  setOpen(false);
                }}
                items={items}
              />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
