import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { db } from '#/api/db';
import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import { getUserImagesDbQuery } from './delete-user.db-query';
import { deleteUserSchema } from './delete-user.schema';

export const deleteUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteUserSchema)
  .handler(async ({ data, context }) => {
    const headers = getRequestHeaders();

    return db.transaction(async (tx) => {
      const publicIdsToDelete = await getUserImagesDbQuery({
        tx,
        data,
        context,
      });

      const { message, success } = await auth.api.deleteUser({
        body: data,
        headers,
      });

      if (success) {
        await deleteCloudinaryAssetsByPublicIds(...publicIdsToDelete);

        return { message };
      } else {
        throw new Error(
          'There was a problem deleting your account. Please try again.',
        );
      }
    });
  });
