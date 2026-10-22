import { createFileRoute } from '@tanstack/react-router';

import { createMetaTags } from '../__root';
import { AdminUsersPage } from '../../pages/AdminUsersPage';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Account: Collection Tracker',
        description: 'Your Collection Tracker account details.',
      }),
    };
  },
});
