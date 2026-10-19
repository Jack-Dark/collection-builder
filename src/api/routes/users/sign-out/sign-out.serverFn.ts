import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

export const signOutServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .handler(async () => {
    const headers = getRequestHeaders();

    await auth.api.signOut({
      headers,
    });
  });
