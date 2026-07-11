import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { updateCollectionDbQuery } from '../queries';
import { updateCollectionByIdSchema } from './update-collection-by-id.schema';

export const updateCollectionByIdServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionByIdSchema)
  .handler(async ({ data }) => {
    return updateCollectionDbQuery(data);
  });
