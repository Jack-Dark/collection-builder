import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { requestVerificationEmailRequestSchema } from './request-verification-email.schema';

export const requestVerificationEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(requestVerificationEmailRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    await auth.api.sendVerificationEmail({
      headers,
      body: {
        ...data,
        callbackURL: '/collections' satisfies RouterPath,
      },
    });

    return {
      message: 'Verification email sent!',
    };
  });
