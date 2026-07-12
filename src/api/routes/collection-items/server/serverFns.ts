import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { baseCollectionItemSchema } from '../base-collection-item.schema';
import {
  createCollectionItemDbQuery,
  getCollectionItemByIdDbQuery,
  updateCollectionItemDbQuery,
} from './queries';

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

export const getCollectionItemServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(
    z.object({
      collectionItemId: z.number(),
    }),
  )
  .handler(async ({ context, data: { collectionItemId } }) => {
    return getCollectionItemByIdDbQuery({
      collectionItemId,
      userId: context.user.id,
    });
  });

export const updateItemAttrsSchema = z.object({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionItemByIdSchema = baseCollectionItemSchema.extend(
  updateItemAttrsSchema.shape,
);

export const updateCollectionItemServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionItemByIdSchema)
  .handler(async ({ data }) => {
    return updateCollectionItemDbQuery(data);
  });
