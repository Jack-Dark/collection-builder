import { createFileRoute, redirect } from '@tanstack/react-router';

import { getSession } from '#/auth/auth-middleware';

export const Route = createFileRoute('/_unprotected/')({
  beforeLoad: async () => {
    const session = await getSession();

    return { user: session?.user };
  },
  loader: () => {
    throw redirect({
      to: '/collections',
    });
  },
});
