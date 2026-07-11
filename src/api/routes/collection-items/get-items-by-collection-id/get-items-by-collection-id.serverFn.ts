import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getItemsByCollectionIdQuery } from '../server/queries';
import { getItemsByCollectionIdSchema } from './get-items-by-collection-id.schema';

export const getItemsByCollectionIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getItemsByCollectionIdSchema)
  .handler(async ({ context, data: { collectionId, params } }) => {
    return getItemsByCollectionIdQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });
