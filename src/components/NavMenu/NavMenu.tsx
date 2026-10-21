import type { NavMenuItem } from './NavMenu.types';

import { ThemeToggles } from '../PageWrapper/components/SiteNavMenu/components/ThemeToggles';
import { DesktopNavMenu } from './components/DesktopNavMenu';
import { MobileNavMenu } from './components/MobileNavMenu';

export const NavMenu = (props: { items: NavMenuItem[] }) => {
  return (
    <div className="p-1">
      <div className="hidden md:inline">
        <DesktopNavMenu {...props} />
      </div>
      <div className="inline md:hidden">
        <MobileNavMenu {...props}>
          <div className="py-1 px-1 md:px-3 flex justify-center w-30">
            <ThemeToggles />
          </div>
        </MobileNavMenu>
      </div>
    </div>
  );
};
