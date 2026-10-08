import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getPaginatedCollectionsDbQuery } from './get-paginated-collections.db-query';
import { getPaginatedCollectionsSchema } from './get-paginated-collections.schema';

export const getPaginatedCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getPaginatedCollectionsSchema)
  .handler(getPaginatedCollectionsDbQuery);
