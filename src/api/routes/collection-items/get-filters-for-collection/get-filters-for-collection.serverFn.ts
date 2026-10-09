import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getFiltersForCollectionDbQuery } from './get-filters-for-collection.db-query';
import { getFiltersForCollectionSchema } from './get-filters-for-collection.schema';

export const getFiltersForCollectionServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getFiltersForCollectionSchema)
  .handler(getFiltersForCollectionDbQuery);
