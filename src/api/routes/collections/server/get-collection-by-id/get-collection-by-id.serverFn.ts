import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { getCollectionById } from '../queries';

export const getCollectionByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(
    z.object({
      collectionId: z.number(),
    }),
  )
  .handler(async ({ context, data: { collectionId } }) => {
    return getCollectionById({
      id: collectionId,
      userId: context.user.id,
    });
  });
