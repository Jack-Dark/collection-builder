import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';
import { deleteCollectionsByIdsSchema } from './delete-collection-by-id.schema';

export const deleteCollectionByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteCollectionsByIdsSchema)
  .handler(async ({ context, data }) => {
    return deleteCollectionDbQuery({
      ids: data.ids,
      userId: context.user.id,
    });
  });
