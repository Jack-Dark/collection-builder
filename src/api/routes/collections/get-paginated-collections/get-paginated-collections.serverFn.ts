import { createServerFn } from '@tanstack/react-start';

import { optionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getPaginatedCollectionsDbQuery } from './get-paginated-collections.db-query';

export const getPaginatedCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(optionalPaginationQueriesSchema)
  .handler(async ({ context, data: params }) => {
    return getPaginatedCollectionsDbQuery({
      params,
      userId: context.user.id,
    });
  });
