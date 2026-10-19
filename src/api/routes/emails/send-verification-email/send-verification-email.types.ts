import type z from 'zod';

import type { sendVerificationEmailSchema } from './send-verification-email.schema';

export type SendVerificationEmailRequestArgs = z.output<
  typeof sendVerificationEmailSchema
>;

export type SendVerificationEmailTemplateArgs = Omit<
  SendVerificationEmailRequestArgs,
  'email'
>;
