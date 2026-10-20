import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { createNewUserExampleRecordsDbQuery } from './sign-up.db-query';
import { signUpRequestSchema } from './sign-up.schema';

export const signUpServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(signUpRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    const { user } = await auth.api.signUpEmail({
      headers,
      body: data,
    });

    await createNewUserExampleRecordsDbQuery({
      context: { user },
      data: undefined,
    });
  });

// TODO - REQUIRED FEATURE: ADD MAX COLLECTIONS/COLLECTION ITEMS/IMAGES VALIDATION
