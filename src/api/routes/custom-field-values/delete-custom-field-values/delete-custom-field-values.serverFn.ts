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
  .handler(async ({ context, data }) => {
    const { ids: records } = data;

    return deleteCustomFieldValuesDbQuery({
      ids: records,
      userId: context.user.id,
    });
  });
