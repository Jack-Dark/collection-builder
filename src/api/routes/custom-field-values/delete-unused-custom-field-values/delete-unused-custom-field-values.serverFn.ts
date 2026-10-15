import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { deleteUnusedCustomFieldValuesDbQuery } from './delete-unused-custom-field-values.db-query';
import { deleteUnusedCustomFieldValuesSchema } from './delete-unused-custom-field-values.schema';

export const deleteUnusedCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteUnusedCustomFieldValuesSchema)
  .handler(deleteUnusedCustomFieldValuesDbQuery);
