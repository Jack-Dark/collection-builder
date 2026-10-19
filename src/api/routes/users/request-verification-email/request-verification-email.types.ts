import type z from 'zod';

import type { requestVerificationEmailRequestSchema } from './request-verification-email.schema';
import type { requestVerificationEmailServerFn } from './request-verification-email.serverFn';

export type RequestVerificationEmailRequestArgsDef = z.output<
  typeof requestVerificationEmailRequestSchema
>;

export type RequestVerificationEmailResponseDef = Awaited<
  ReturnType<typeof requestVerificationEmailServerFn>
>;
