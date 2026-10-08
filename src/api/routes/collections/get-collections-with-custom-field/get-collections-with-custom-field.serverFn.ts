import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getCollectionsWithCustomFieldsDbQuery } from './get-collections-with-custom-field.db-query';
import { getCollectionsWithCustomFieldsSchema } from './get-collections-with-custom-field.schema';

export const getCollectionsWithCustomFieldsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getCollectionsWithCustomFieldsSchema)
  .handler(getCollectionsWithCustomFieldsDbQuery);
