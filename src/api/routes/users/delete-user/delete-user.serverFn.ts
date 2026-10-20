import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { deleteUserSchema } from './delete-user.schema';

export const deleteUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteUserSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    // TODO - REQUIRED FEATURE: ADD LOGIC TO FIND ALL IMAGES AND DELETE THEM FROM CLOUDINARY ON SUCCESS

    const { message, success } = await auth.api.deleteUser({
      body: data,
      headers,
    });

    if (success) {
      return { message };
    } else {
      throw new Error(
        'There was a problem deleting your account. Please try again.',
      );
    }
  });
