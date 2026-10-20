import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

export const signOutServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .handler(async () => {
    const headers = getRequestHeaders();

    await auth.api.signOut({
      headers,
    });
  });
