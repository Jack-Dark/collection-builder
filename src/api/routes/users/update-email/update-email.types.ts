import type z from 'zod';

import type { updateEmailRequestSchema } from './update-email.schema';
import type { updateEmailServerFn } from './update-email.serverFn';

export type UpdateEmailRequestArgsDef = z.output<
  typeof updateEmailRequestSchema
>;

export type UpdateEmailResponseDef = Awaited<
  ReturnType<typeof updateEmailServerFn>
>;
