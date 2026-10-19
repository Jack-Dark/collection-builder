import type z from 'zod';

import type { updatePasswordRequestSchema } from './update-password.schema';
import type { updatePasswordServerFn } from './update-password.serverFn';

export type UpdatePasswordRequestArgsDef = z.output<
  typeof updatePasswordRequestSchema
>;

export type UpdatePasswordResponseDef = Awaited<
  ReturnType<typeof updatePasswordServerFn>
>;
