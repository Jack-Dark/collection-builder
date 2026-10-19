import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { resetPasswordSchema } from './reset-password.schema';

export const resetPasswordServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(resetPasswordSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    const { status } = await auth.api.resetPassword({
      body: data,
      headers,
    });

    if (!status) {
      throw new Error('Unable to reset password');
    }
  });
