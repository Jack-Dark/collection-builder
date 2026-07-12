import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';
import { deleteCollectionByIdSchema } from './delete-collection-by-id.schema';

export const deleteCollectionByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(deleteCollectionByIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return deleteCollectionDbQuery({
      id: collectionId,
      userId: context.user.id,
    });
  });
