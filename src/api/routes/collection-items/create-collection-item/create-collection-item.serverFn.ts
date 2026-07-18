import { createServerFn } from '@tanstack/react-start';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { createCollectionItemsDbQuery } from './create-collection-item.db-query';
import { createCollectionItemsServerFnSchema } from './create-collection-item.schema';

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionItemsServerFnSchema)
  .handler(async ({ context, data }) => {
    const { publicIds, records } = data;

    const recordsWithUserId = records.map((item) => {
      return {
        ...item,
        userId: context.user.id,
      };
    });

    return createCollectionItemsDbQuery({
      publicIds,
      records: recordsWithUserId,
    });
  });
