import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { updateCollection } from '../queries';
import { updateCollectionSchema } from '../serverFns';

export const updateCollectionByIdServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionSchema)
  .handler(async ({ data }) => {
    return updateCollection(data);
  });
