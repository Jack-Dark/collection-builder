import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { SignInPage } from '#/pages/SignInPage';

export const Route = createFileRoute('/_unprotected/sign-in')({
  component: SignInPage,
  validateSearch: z.object({
    resetPassword: z.boolean().optional(),
    redirect: z.string().optional(),
  }),
});
