import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { getSession } from '#/auth/auth-middleware';
import { SignInPage } from '#/pages/SignInPage';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/sign-in')({
  validateSearch: z.object({
    resetPassword: z.boolean().optional(),
    redirect: z.string().optional(),
  }),
  component: SignInPage,
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
        title: 'Sign In: Collection Tracker',
        description: 'Sign in to your Collection Tracker account.',
      }),
    };
  },
});
