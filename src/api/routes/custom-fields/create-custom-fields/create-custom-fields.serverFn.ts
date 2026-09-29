import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { createCustomFieldsDbQuery } from './create-custom-fields.db-query';
import { createCustomFieldsSchema } from './create-custom-fields.schema';

export const createCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCustomFieldsSchema)
  .handler(async ({ context, data }) => {
    const { records } = data;

    const recordsWithUserId = records.map((item) => {
      return {
        ...item,
        userId: context.user.id,
      };
    });

    return createCustomFieldsDbQuery({
      records: recordsWithUserId,
    });
  });
