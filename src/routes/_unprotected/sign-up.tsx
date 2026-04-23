import { createFileRoute } from '@tanstack/react-router';

import { SignUpPage } from '#/pages/SignUpPage';

export const Route = createFileRoute('/_unprotected/sign-up')({
  component: SignUpPage,
});
