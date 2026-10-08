import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { createCustomFieldsDbQuery } from './create-custom-fields.db-query';
import { createCustomFieldsSchema } from './create-custom-fields.schema';

export const createCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(createCustomFieldsSchema)
  .handler(createCustomFieldsDbQuery);
