import {
  passwordSchema,
  passwordMismatchErrorMessage,
} from '#/api/routes/users/sign-up/sign-up.schema';
import { updatePasswordRequestSchema } from '#/api/routes/users/update-password/update-password.schema';

export const updatePasswordFormSchema = updatePasswordRequestSchema
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
