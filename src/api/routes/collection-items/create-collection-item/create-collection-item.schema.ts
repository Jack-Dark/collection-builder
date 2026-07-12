import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { baseCollectionItemSchema } from '../base-collection-item.schema';
import { createCollectionItemDbQuery } from '../server/queries';

export const createItemAttrsSchema = z.object({
  createdAt: z.undefined(),
  id: z.undefined(),
  userId: z.undefined(),
});

export const createCollectionItemSchema = baseCollectionItemSchema.extend(
  createItemAttrsSchema.shape,
);

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionItemSchema)
  .handler(async ({ context, data }) => {
    const { createdAt: _createdAt, id: _id, userId: _userId, ...rest } = data;

    return createCollectionItemDbQuery({
      ...rest,
      userId: context.user.id,
    });
  });
