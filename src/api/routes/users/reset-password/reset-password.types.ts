import type z from 'zod';

import type { resetPasswordSchema } from './reset-password.schema';
import type { resetPasswordServerFn } from './reset-password.serverFn';

export type ResetPasswordRequestArgsDef = z.output<typeof resetPasswordSchema>;

export type ResetPasswordResponseDef = Awaited<
  ReturnType<typeof resetPasswordServerFn>
>;
