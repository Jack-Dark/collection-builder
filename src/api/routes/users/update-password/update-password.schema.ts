import z from 'zod';

import { passwordSchema } from '../sign-up/sign-up.schema';

export const updatePasswordRequestSchema = z.object({
  newPassword: passwordSchema,
  currentPassword: passwordSchema,
});
