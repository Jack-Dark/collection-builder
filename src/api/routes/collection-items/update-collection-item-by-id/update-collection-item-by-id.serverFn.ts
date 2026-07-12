import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { updateCollectionItemDbQuery } from './update-collection-item-by-id.db-query';
import { updateCollectionItemByIdSchema } from './update-collection-item-by-id.schema';

export const updateCollectionItemServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionItemByIdSchema)
  .handler(async ({ data }) => {
    return updateCollectionItemDbQuery(data);
  });
