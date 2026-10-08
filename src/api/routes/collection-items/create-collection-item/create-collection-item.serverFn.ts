import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { createCollectionItemsDbQuery } from './create-collection-item.db-query';
import { createCollectionItemsServerFnSchema } from './create-collection-item.schema';

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(createCollectionItemsServerFnSchema)
  .handler(createCollectionItemsDbQuery);
