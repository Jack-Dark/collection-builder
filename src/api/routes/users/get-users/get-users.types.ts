import type z from 'zod';

import type { getUsersRequestSchema } from './get-users.schema';
import type { getUsersServerFn } from './get-users.serverFn';

export type GetUsersRequestArgsDef = z.output<typeof getUsersRequestSchema>;

export type GetUsersResponseDef = Awaited<ReturnType<typeof getUsersServerFn>>;
