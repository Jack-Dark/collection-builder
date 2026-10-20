import type z from 'zod';

import type { deleteUserSchema } from './delete-user.schema';
import type { deleteUserServerFn } from './delete-user.serverFn';

export type DeleteUserRequestArgsDef = z.output<typeof deleteUserSchema>;

export type DeleteUserResponseDef = Awaited<
  ReturnType<typeof deleteUserServerFn>
>;
