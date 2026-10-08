import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { createCustomFieldValuesDbQuery } from './create-custom-field-value.db-query';
import { createCustomFieldValuesSchema } from './create-custom-field-value.schema';

export const createCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(createCustomFieldValuesSchema)
  .handler(createCustomFieldValuesDbQuery);
