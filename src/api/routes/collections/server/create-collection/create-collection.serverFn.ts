import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { createCollection } from '../queries';
import { createCollectionSchema } from './create-collection.schema';

export const createCollectionServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionSchema)
  .handler(async ({ context, data }) => {
    return createCollection({
      ...data,
      userId: context.user.id,
    });
  });
