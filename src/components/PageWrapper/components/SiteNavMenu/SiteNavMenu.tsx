import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from '@tanstack/react-router';

import type { RouterPath } from '../../../../types';
import type { NavMenuItem } from '../../../NavMenu/NavMenu.types';

import { useGetNavMenuCollections } from '../../../../api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { authClient } from '../../../../auth/auth-client';
import { Route as CollectionsRoute } from '../../../../routes/_protected/collections';
import { Route as CollectionRoute } from '../../../../routes/_protected/collections/$id';
import { NavMenu } from '../../../NavMenu';
import { ThemeToggles } from './components/ThemeToggles';

export const SiteNavMenu = () => {
  const { data } = useGetNavMenuCollections({
    placeholderData: {
      collections: [],
    },
    requestArgs: {},
  });

  const { collections } = data;

  const router = useRouter();

  const { data: session } = authClient.useSession();

  const isLoggedOut = !session?.user.id;

  const navItems: NavMenuItem[] = [
    {
      href: CollectionsRoute.fullPath,
      items: collections?.map((collection) => {
        return {
          href: CollectionRoute.fullPath.replace('$id', String(collection.id)),
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
          RenderItem: ThemeToggles,
        },
        {
          hidden: isLoggedOut,
          href: '/sign-out',
          label: 'Sign out',
          onClick: async (e) => {
            e.preventDefault();

            await authClient.signOut();
            router.navigate({ to: '/sign-in' });
          },
        },
      ],
      label: 'Account',
    },
  ];

  return <NavMenu items={navItems} />;
};
