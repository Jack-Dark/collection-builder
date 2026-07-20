import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';
import { deleteCollectionsByIdsSchema } from './delete-collection-by-id.schema';

export const deleteCollectionByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(deleteCollectionsByIdsSchema)
  .handler(async ({ context, data }) => {
    return deleteCollectionDbQuery({
      ids: data.ids,
      userId: context.user.id,
    });
  });
