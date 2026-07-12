import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollectionItemByIdDbQuery } from './delete-collection-item-by-id.db-query';
import { deleteCollectionItemByIdSchema } from './delete-collection-item-by-id.schema';

export const deleteCollectionItemByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(deleteCollectionItemByIdSchema)
  .handler(async ({ context, data: { collectionItemId } }) => {
    return deleteCollectionItemByIdDbQuery({
      id: collectionItemId,
      userId: context.user.id,
    });
  });
