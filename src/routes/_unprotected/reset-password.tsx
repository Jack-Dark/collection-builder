import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { ResetPasswordPage } from '#/pages/ResetPasswordPage';

import { createMetaTags } from '../__root';

const resetPasswordSearchSchema = z.object({
  email: z.email(),
  token: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
});

export const Route = createFileRoute('/_unprotected/reset-password')({
  component: ResetPasswordPage,
  validateSearch: resetPasswordSearchSchema,
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Reset Password: Collection Tracker',
        description: 'Reset the password to your Collection Tracker account.',
      }),
    };
  },
});
