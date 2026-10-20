import z from 'zod';

import { passwordSchema } from '../sign-up/sign-up.schema';

export const deleteUserSchema = z.object({
  password: passwordSchema,
});
