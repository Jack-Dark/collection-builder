import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getNavMenuCollectionsDbQuery } from './get-nav-menu-collections.db-query';
import { getNavMenuCollectionsSchema } from './get-nav-menu-collections.schema';

export const getNavMenuCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getNavMenuCollectionsSchema)
  .handler(async ({ context }) => {
    return getNavMenuCollectionsDbQuery({
      userId: context.user.id,
    });
  });
