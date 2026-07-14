import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { updateCollectionItemDbQuery } from './update-collection-item-by-id.db-query';
import { updateCollectionItemByIdServerFnSchema } from './update-collection-item-by-id.schema';

export const updateCollectionItemByIdServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionItemByIdServerFnSchema)
  .handler(async ({ data }) => {
    return updateCollectionItemDbQuery(data);
  });
