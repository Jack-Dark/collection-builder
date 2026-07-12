import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { updateCollectionByIdDbQuery } from './update-collection-by-id.db-query';
import { updateCollectionByIdSchema } from './update-collection-by-id.schema';

export const updateCollectionByIdServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionByIdSchema)
  .handler(async ({ data }) => {
    return updateCollectionByIdDbQuery(data);
  });
