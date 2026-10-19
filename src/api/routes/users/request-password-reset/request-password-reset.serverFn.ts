import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { requestPasswordResetSchema } from './request-password-reset.schema';

export const requestPasswordResetServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(requestPasswordResetSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    const { message, status } = await auth.api.requestPasswordReset({
      body: data,
      headers,
    });

    if (!status) {
      throw new Error('Unable to reset password');
    }

    return { message };
  });
