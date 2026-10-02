import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getPaginatedCollectionsDbQuery } from './get-paginated-collections.db-query';
import { getPaginatedCollectionsSchema } from './get-paginated-collections.schema';

export const getPaginatedCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getPaginatedCollectionsSchema)
  .handler(async ({ context, data }) => {
    return getPaginatedCollectionsDbQuery({
      params: data.params,
      userId: context.user.id,
    });
  });
