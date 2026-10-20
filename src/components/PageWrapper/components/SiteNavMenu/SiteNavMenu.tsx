import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useSignOut } from '#/api/routes/users/sign-out/sign-out.react-query';
import { useUserContext } from '#/hooks/use-user-context';

import type { RouterPath } from '../../../../types';
import type { NavMenuItem } from '../../../NavMenu/NavMenu.types';

import { useGetNavMenuCollections } from '../../../../api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { Route as CollectionsRoute } from '../../../../routes/_protected/collections';
import { Route as CollectionRoute } from '../../../../routes/_protected/collections/$id';
import { NavMenu } from '../../../NavMenu';
import { ThemeToggles } from './components/ThemeToggles';

// TODO - REQUIRED FEATURE: BUILD MOBILE NAV SUPPORT
export const SiteNavMenu = () => {
  const { data } = useGetNavMenuCollections({
    placeholderData: {
      collections: [],
    },
    requestArgs: {},
  });

  const { collections } = data;

  const user = useUserContext();

  const { onSignOut } = useSignOut({
    onSuccess: () => {},
  });

  const isLoggedIn = user?.id;

  const navItems: NavMenuItem[] = isLoggedIn
    ? [
        {
          href: CollectionsRoute.fullPath,
          items: collections.map((collection) => {
            return {
              href: CollectionRoute.fullPath.replace(
                '$id',
                String(collection.id),
              ),
              label: collection.name,
            };
          }),
          label: 'Collections',
        },
        {
          href: '/account' satisfies RouterPath,
          Icon: AccountCircleIcon,
          items: [
            {
              href: '#sign-out',
              label: 'Sign out',
              onClick: async () => {
                await onSignOut({});
              },
            },
          ],
          label: 'Account',
        },
      ]
    : [
        {
          href: '/about' satisfies RouterPath,
          label: 'About',
        },
        {
          href: '/why-its-important' satisfies RouterPath,
          label: "Why it's Important",
        },
        {
          href: '/sign-in' satisfies RouterPath,
          Icon: AccountCircleIcon,
          items: [
            {
              href: '/sign-in' satisfies RouterPath,
              label: 'Sign In',
            },
            {
              href: '/sign-up' satisfies RouterPath,
              label: 'Sign Up',
            },
          ],
          label: 'Sign In / Sign Up',
        },
      ];

  return (
    <div className="flex justify-between items-center bg-theme-surface-1 text-theme-t1">
      <NavMenu items={navItems} />

      <div className="py-1 px-3 flex justify-center w-30">
        <ThemeToggles />
      </div>
    </div>
  );
};
