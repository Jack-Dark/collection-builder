import { createServerFn } from '@tanstack/react-start';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { signUpRequestSchema } from './sign-up.schema';

export const signUpServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(signUpRequestSchema)
  .handler(async ({ data }) => {
    await auth.api.signUpEmail({
      body: data,
    });

    // TODO - REQUIRED FEATURE: ADD QUERY TO CREATE FIRST COLLECTION, CUSTOM FIELD, ITEM, AND CUSTOM FIELD VALUE
    // TODO - REQUIRED FEATURE: ADD MAX COLLECTIONS/COLLECTION ITEMS/IMAGES VALIDATION
  });
