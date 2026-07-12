import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { baseCollectionItemSchema } from '../base-collection-item.schema';
import { updateCollectionItemDbQuery } from '../server/queries';

export const updateItemAttrsSchema = z.object({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionItemByIdSchema = baseCollectionItemSchema.extend(
  updateItemAttrsSchema.shape,
);

export const updateCollectionItemServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionItemByIdSchema)
  .handler(async ({ data }) => {
    return updateCollectionItemDbQuery(data);
  });
