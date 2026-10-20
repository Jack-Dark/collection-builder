import { createFileRoute } from '@tanstack/react-router';

import { SignUpPage } from '#/pages/SignUpPage';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/sign-up')({
  component: SignUpPage,
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Sign Up: Collection Tracker',
        description: 'Sign up for a Collection Tracker account.',
      }),
    };
  },
});
