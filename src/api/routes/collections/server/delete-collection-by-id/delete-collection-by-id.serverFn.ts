import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { deleteCollection } from '../queries';

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
    return deleteCollection({
      id: collectionId,
      userId: context.user.id,
    });
  });
