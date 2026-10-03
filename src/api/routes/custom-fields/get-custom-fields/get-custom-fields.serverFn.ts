import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getCustomFieldsDbQuery } from './get-custom-fields.db-query';
import { getCustomFieldsSchema } from './get-custom-fields.schema';

export const getCustomFieldsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getCustomFieldsSchema)
  .handler(async ({ context, data }) => {
    return getCustomFieldsDbQuery({
      userId: context.user.id,
      ...data,
    });
  });
