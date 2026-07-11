import { createServerFn } from '@tanstack/react-start';

import { optionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getAllCollections } from '../queries';

export const getAllCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(optionalPaginationQueriesSchema)
  .handler(async ({ context, data: params }) => {
    return getAllCollections({
      params,
      userId: context.user.id,
    });
  });
