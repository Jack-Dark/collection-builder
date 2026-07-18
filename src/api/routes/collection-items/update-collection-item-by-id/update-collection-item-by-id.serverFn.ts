import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { updateCollectionItemsDbQuery } from './update-collection-item-by-id.db-query';
import { updateCollectionItemsServerFnSchema } from './update-collection-item-by-id.schema';

export const updateCollectionItemsServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionItemsServerFnSchema)
  .handler(async ({ data }) => {
    return updateCollectionItemsDbQuery(data);
  });
