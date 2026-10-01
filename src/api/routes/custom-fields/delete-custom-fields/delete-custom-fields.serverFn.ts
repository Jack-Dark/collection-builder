import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCustomFieldsDbQuery } from './delete-custom-fields.db-query';
import { deleteCustomFieldsSchema } from './delete-custom-fields.schema';

export const deleteCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(deleteCustomFieldsSchema)
  .handler(async ({ context, data }) => {
    return deleteCustomFieldsDbQuery({
      userId: context.user.id,
      ...data,
    });
  });
