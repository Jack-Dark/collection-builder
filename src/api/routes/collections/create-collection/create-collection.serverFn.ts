import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { createCollectionDbQuery } from './create-collection.db-query';
import { createCollectionServerFnSchema } from './create-collection.schema';

export const createCollectionServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionServerFnSchema)
  .handler(async ({ context, data }) => {
    return createCollectionDbQuery({
      ...data,
      userId: context.user.id,
    });
  });
