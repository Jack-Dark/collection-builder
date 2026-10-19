import type z from 'zod';

import type { signInRequestSchema } from './sign-in.schema';
import type { signInServerFn } from './sign-in.serverFn';

export type SignInRequestArgsDef = z.output<typeof signInRequestSchema>;

export type SignInResponseDef = Awaited<ReturnType<typeof signInServerFn>>;
