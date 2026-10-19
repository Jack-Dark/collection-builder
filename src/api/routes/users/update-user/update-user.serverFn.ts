import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { updateUserDbQuery } from './update-user.db-query';
import { updateUserSchema } from './update-user.schema';

export const updateUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(updateUserSchema)
  .handler(updateUserDbQuery);
