import type z from 'zod';

import type { impersonateUserRequestSchema } from './impersonate-user.schema';
import type { impersonateUserServerFn } from './impersonate-user.serverFn';

export type ImpersonateUserRequestArgsDef = z.output<
  typeof impersonateUserRequestSchema
>;

export type ImpersonateUserResponseDef = Awaited<
  ReturnType<typeof impersonateUserServerFn>
>;
