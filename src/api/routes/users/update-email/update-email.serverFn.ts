import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { updateEmailRequestSchema } from './update-email.schema';

export const updateEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(updateEmailRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    await auth.api.changeEmail({
      headers,
      body: {
        ...data,
        callbackURL: '/account' satisfies RouterPath,
      },
    });

    return {
      message: `A verification email has been sent to ${data.newEmail}`,
    };
  });
