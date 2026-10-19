import z from 'zod';

import {
  passwordMismatchErrorMessage,
  passwordSchema,
} from '../sign-up/sign-up.schema';

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  token: z.string().min(1),
});

export const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmNewPassword: passwordSchema,
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: passwordMismatchErrorMessage,
      path: ['confirmNewPassword'],
    },
  );
