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
  .handler(async ({ context, data }) => {
    const { records } = data;

    const recordsWithUserId = records.map((item) => {
      return {
        ...item,
        userId: context.user.id,
      };
    });

    return updateCustomFieldsDbQuery({
      records: recordsWithUserId,
    });
  });
