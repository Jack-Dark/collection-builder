import type { NavMenuItem } from './NavMenu.types';

import { DesktopNavMenu } from './components/DesktopNavMenu';
import { MobileNavMenu } from './components/MobileNavMenu';

export const NavMenu = (props: { items: NavMenuItem[] }) => {
  return (
    <div className="p-1">
      <div className="hidden md:inline">
        <DesktopNavMenu {...props} />
      </div>
      <div className="inline md:hidden">
        <MobileNavMenu {...props} />
      </div>
    </div>
  );
};
