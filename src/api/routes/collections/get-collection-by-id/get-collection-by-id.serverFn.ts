import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getCollectionByIdDbQuery } from './get-collection-by-id.db-query';
import { getCollectionByIdSchema } from './get-collection-by-id.schema';

export const getCollectionByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getCollectionByIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return getCollectionByIdDbQuery({
      id: collectionId,
      userId: context.user.id,
    });
  });
