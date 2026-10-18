import { createServerFn } from '@tanstack/react-start';

import {
  errorHandlingMiddleware,
  softAuthApiRouteMiddleware,
} from '#/auth/auth-middleware';

import { getNavMenuCollectionsDbQuery } from './get-nav-menu-collections.db-query';
import { getNavMenuCollectionsSchema } from './get-nav-menu-collections.schema';

export const getNavMenuCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, softAuthApiRouteMiddleware])
  .validator(getNavMenuCollectionsSchema)
  .handler(getNavMenuCollectionsDbQuery);
