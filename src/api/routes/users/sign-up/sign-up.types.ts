import type z from 'zod';

import type { signUpRequestSchema } from './sign-up.schema';
import type { signUpServerFn } from './sign-up.serverFn';

export type SignUpRequestArgsDef = z.output<typeof signUpRequestSchema>;

export type SignUpResponseDef = Awaited<ReturnType<typeof signUpServerFn>>;
