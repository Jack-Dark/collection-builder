import { createFileRoute, redirect } from '@tanstack/react-router';

import { getSession } from '#/auth/auth-middleware';
import { SignUpPage } from '#/pages/SignUpPage';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/sign-up')({
  component: SignUpPage,
  beforeLoad: () => {
    return getSession();
  },
  loader: ({ context }) => {
    if (context.user?.id)
      throw redirect({
        to: '/collections',
      });
  },
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Sign Up: Collection Tracker',
        description: 'Sign up for a Collection Tracker account.',
      }),
    };
  },
});
