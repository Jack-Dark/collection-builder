import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getCustomFieldValuesByCustomFieldIdDbQuery } from './get-custom-field-values-by-collection-id.db-query';
import { getCustomFieldValuesByCustomFieldIdSchema } from './get-custom-field-values-by-collection-id.schema';

export const getCustomFieldValuesByCustomFieldIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getCustomFieldValuesByCustomFieldIdSchema)
  .handler(async ({ context, data }) => {
    return getCustomFieldValuesByCustomFieldIdDbQuery({
      ...data,
      userId: context.user.id,
    });
  });
