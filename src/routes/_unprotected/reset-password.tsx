import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { ResetPasswordPage } from '#/pages/ResetPasswordPage';

export const Route = createFileRoute('/_unprotected/reset-password')({
  component: ResetPasswordPage,
  validateSearch: z.object({
    email: z.email(),
    token: z.string().min(1).optional(),
    error: z.string().min(1).optional(),
  }),
});
