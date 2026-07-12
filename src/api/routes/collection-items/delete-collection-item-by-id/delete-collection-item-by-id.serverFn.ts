import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollectionItemByIdDbQuery } from '../server/queries';

export const deleteCollectionItemByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(
    z.object({
      collectionItemId: z.number(),
    }),
  )
  .handler(async ({ context, data: { collectionItemId } }) => {
    return deleteCollectionItemByIdDbQuery({
      id: collectionItemId,
      userId: context.user.id,
    });
  });
