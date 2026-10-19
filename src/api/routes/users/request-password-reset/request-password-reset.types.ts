import type z from 'zod';

import type { requestPasswordResetSchema } from './request-password-reset.schema';
import type { requestPasswordResetServerFn } from './request-password-reset.serverFn';

export type RequestPasswordResetRequestArgsDef = z.output<
  typeof requestPasswordResetSchema
>;

export type RequestPasswordResetResponseDef = Awaited<
  ReturnType<typeof requestPasswordResetServerFn>
>;
