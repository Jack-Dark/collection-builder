import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { createCollectionItemDbQuery } from './create-collection-item.db-query';
import { createCollectionItemServerFnSchema } from './create-collection-item.schema';

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionItemServerFnSchema)
  .handler(async ({ context, data }) => {
    return createCollectionItemDbQuery({
      ...data,
      userId: context.user.id,
    });
  });
