import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';

export const deleteCollectionByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(
    z.object({
      collectionId: z.number(),
    }),
  )
  .handler(async ({ context, data: { collectionId } }) => {
    return deleteCollectionDbQuery({
      id: collectionId,
      userId: context.user.id,
    });
  });
