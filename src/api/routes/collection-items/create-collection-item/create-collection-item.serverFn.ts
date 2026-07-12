import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { createCollectionItemDbQuery } from './create-collection-item.db-query';
import { createCollectionItemSchema } from './create-collection-item.schema';

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionItemSchema)
  .handler(async ({ context, data }) => {
    const { createdAt: _createdAt, id: _id, userId: _userId, ...rest } = data;

    return createCollectionItemDbQuery({
      ...rest,
      userId: context.user.id,
    });
  });
