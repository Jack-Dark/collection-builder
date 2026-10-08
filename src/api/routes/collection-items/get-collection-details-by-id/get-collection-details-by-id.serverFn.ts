import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getCollectionDetailsByIdDbQuery } from './get-collection-details-by-id.db-query';
import { getCollectionDetailsByIdSchema } from './get-collection-details-by-id.schema';

export const getCollectionDetailsByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getCollectionDetailsByIdSchema)
  .handler(getCollectionDetailsByIdDbQuery);
