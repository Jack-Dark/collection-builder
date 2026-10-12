import { createServerFn } from '@tanstack/react-start';

import {
  errorHandlingMiddleware,
  userContextMiddleware,
} from '#/auth/auth-middleware';

import { getNavMenuCollectionsDbQuery } from './get-nav-menu-collections.db-query';
import { getNavMenuCollectionsSchema } from './get-nav-menu-collections.schema';

export const getNavMenuCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, userContextMiddleware])
  .validator(getNavMenuCollectionsSchema)
  .handler(getNavMenuCollectionsDbQuery);
