import type z from 'zod';

import type { updateUserSchema } from './update-user.schema';
import type { updateUserServerFn } from './update-user.serverFn';

export type UpdateUserRequestArgsDef = z.output<typeof updateUserSchema>;

export type UpdateUserResponseDef = Awaited<
  ReturnType<typeof updateUserServerFn>
>;
