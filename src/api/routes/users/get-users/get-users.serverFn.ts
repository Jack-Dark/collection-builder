import { createServerFn } from '@tanstack/react-start';

import {
  authAdminApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getUsersDbQuery } from './get-users.db-query';
import { getUsersRequestSchema } from './get-users.schema';

export const getUsersServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authAdminApiRouteMiddleware])
  .validator(getUsersRequestSchema)
  .handler(getUsersDbQuery);
