import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { createCollectionDbQuery } from './create-collection.db-query';
import { createCollectionServerFnSchema } from './create-collection.schema';

export const createCollectionServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(createCollectionServerFnSchema)
  .handler(async ({ context, data }) => {
    try {
      const { records } = data;

      const recordsWithUserId = records.map((item) => {
        return {
          ...item,
          userId: context.user.id,
        };
      });

      return createCollectionDbQuery(recordsWithUserId);
    } catch (error) {
      throw error as Error;
    }

    // return formatServerResponse(() => {
    //   const { records } = data;

    //   const recordsWithUserId = records.map((item) => {
    //     return {
    //       ...item,
    //       userId: context.user.id,
    //     };
    //   });

    //   return createCollectionDbQuery(recordsWithUserId);
    // });
  });
