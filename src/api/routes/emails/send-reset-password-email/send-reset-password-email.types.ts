import type z from 'zod';

import type { sendResetPasswordEmailSchema } from './send-reset-password-email.schema';

export type SendResetPasswordEmailRequestArgs = z.output<
  typeof sendResetPasswordEmailSchema
>;

export type ResetPasswordEmailTemplatePropsDef = Omit<
  SendResetPasswordEmailRequestArgs,
  'email'
>;
