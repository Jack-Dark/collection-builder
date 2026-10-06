import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getCollectionItemsWithCustomFieldValueDbQuery } from './get-collection-items-with-custom-field-value.db-query';
import { getCollectionItemsWithCustomFieldValueSchema } from './get-collection-items-with-custom-field-value.schema';

export const getCollectionItemsWithCustomFieldValueServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getCollectionItemsWithCustomFieldValueSchema)
  .handler(async ({ context, data }) => {
    return getCollectionItemsWithCustomFieldValueDbQuery({
      ...data,
      userId: context.user.id,
    });
  });
