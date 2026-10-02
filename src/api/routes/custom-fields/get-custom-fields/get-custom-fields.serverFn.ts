import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getCustomFieldsDbQuery } from './get-custom-fields.db-query';
import { getCustomFieldsSchema } from './get-custom-fields.schema';

export const getCustomFieldsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(getCustomFieldsSchema)
  .handler(async ({ context, data }) => {
    try {
      // return formatServerResponse(() => {
      return getCustomFieldsDbQuery({
        userId: context.user.id,
        ...data.params,
      });
      // });
    } catch (error) {
      throw error as Error;
    }
  });
