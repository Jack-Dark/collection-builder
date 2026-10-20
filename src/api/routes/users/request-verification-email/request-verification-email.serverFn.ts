import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';
import { configs } from '#/configs';

import { requestVerificationEmailRequestSchema } from './request-verification-email.schema';

export const requestVerificationEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(requestVerificationEmailRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    const callbackURL = `${configs.siteUrl}/collections`;
    console.log('🚀 ~ requestVerificationEmail callbackURL:', callbackURL);

    await auth.api.sendVerificationEmail({
      headers,
      body: {
        ...data,
        callbackURL,
      },
    });

    return {
      message: 'Verification email sent!',
    };
  });
