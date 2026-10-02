import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { updateCollectionByIdDbQuery } from './update-collection-by-id.db-query';
import { updateCollectionsServerFnSchema } from './update-collection-by-id.schema';

export const updateCollectionByIdServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(updateCollectionsServerFnSchema)
  .handler(async ({ data }) => {
    return updateCollectionByIdDbQuery(data);
  });
