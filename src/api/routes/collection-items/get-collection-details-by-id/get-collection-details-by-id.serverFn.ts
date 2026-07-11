import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getCollectionDetailsByIdDbQuery } from './get-collection-details-by-id.db-query';
import { getCollectionDetailsByIdSchema } from './get-collection-details-by-id.schema';

export const getCollectionDetailsByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getCollectionDetailsByIdSchema)
  .handler(async ({ context, data: { collectionId, params } }) => {
    return getCollectionDetailsByIdDbQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });
