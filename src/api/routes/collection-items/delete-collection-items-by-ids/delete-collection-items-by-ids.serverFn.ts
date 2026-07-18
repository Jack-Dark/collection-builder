import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollectionItemsByIdsDbQuery } from './delete-collection-items-by-ids.db-query';
import { deleteCollectionItemsByIdsSchema } from './delete-collection-items-by-ids.schema';

export const deleteCollectionItemsByIdsServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(deleteCollectionItemsByIdsSchema)
  .handler(async ({ context, data: { collectionItemIds } }) => {
    return deleteCollectionItemsByIdsDbQuery({
      ids: collectionItemIds,
      userId: context.user.id,
    });
  });
