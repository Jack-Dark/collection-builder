import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { deleteCustomFieldsDbQuery } from './delete-custom-fields.db-query';
import { deleteCustomFieldsSchema } from './delete-custom-fields.schema';

export const deleteCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteCustomFieldsSchema)
  .handler(deleteCustomFieldsDbQuery);
