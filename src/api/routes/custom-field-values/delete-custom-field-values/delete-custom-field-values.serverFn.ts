import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { deleteCustomFieldValuesDbQuery } from './delete-custom-field-values.db-query';
import { deleteCustomFieldValuesSchema } from './delete-custom-field-values.schema';

export const deleteCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteCustomFieldValuesSchema)
  .handler(deleteCustomFieldValuesDbQuery);
