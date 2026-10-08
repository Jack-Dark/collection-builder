import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { updateCustomFieldsDbQuery } from './update-custom-fields.db-query';
import { updateCustomFieldsSchema } from './update-custom-fields.schema';

export const updateCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(updateCustomFieldsSchema)
  .handler(updateCustomFieldsDbQuery);
