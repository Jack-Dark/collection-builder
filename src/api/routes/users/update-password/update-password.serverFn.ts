import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { updatePasswordRequestSchema } from './update-password.schema';

export const updatePasswordServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(updatePasswordRequestSchema)
  .handler(async ({ data }) => {
    const { newPassword, currentPassword } = data;

    const headers = getRequestHeaders();

    await auth.api.changePassword({
      headers,
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
    });

    return { message: 'Your password has been reset' };
  });
