import { createFileRoute } from '@tanstack/react-router';

import { AccountPage } from '#/pages/AccountPage';

export const Route = createFileRoute('/_protected/account')({
  component: AccountPage,
});
