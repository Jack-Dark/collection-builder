import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import {
  createCollectionItemDbQuery,
  deleteCollectionItemByIdDbQuery,
  getCollectionItemByIdDbQuery,
  updateCollectionItemDbQuery,
} from './queries';

const baseCollectionItemSchema = z.object({
  collectionId: z.number().describe('Collection ID'),
  customField1Value: z.string().describe('[customField1Value] placeholder'),
  customField2Value: z.string().describe('[customField2Value] placeholder'),
  customField3Value: z.string().describe('[customField3Value] placeholder'),
  editionDetails: z.string().describe('Edition details'),
  images: z
    .array(
      z.union([
        z.string(),
        z.file().min(10_000).max(1_000_000).mime('image/*'),
      ]),
    )
    .describe('Images'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});

const createItemSchema = z.object({
  createdAt: z.undefined(),
  id: z.undefined(),
  userId: z.undefined(),
});

const updateItemSchema = z.object({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const collectionItemFormSchema = baseCollectionItemSchema.and(
  z.union([createItemSchema, updateItemSchema]),
);

export const createCollectionItemSchema = baseCollectionItemSchema.extend(
  createItemSchema.shape,
);

export const updateCollectionItemSchema = baseCollectionItemSchema.extend(
  updateItemSchema.shape,
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

const requireCollectionItemIdSchema = z.object({
  collectionItemId: z.number(),
});

export const getCollectionItemServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionItemIdSchema)
  .handler(async ({ context, data: { collectionItemId } }) => {
    return getCollectionItemByIdDbQuery({
      collectionItemId,
      userId: context.user.id,
    });
  });

export const updateCollectionItemServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionItemSchema)
  .handler(async ({ data }) => {
    return updateCollectionItemDbQuery(data);
  });

export const deleteCollectionItemServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionItemIdSchema)
  .handler(async ({ context, data: { collectionItemId } }) => {
    return deleteCollectionItemByIdDbQuery({
      id: collectionItemId,
      userId: context.user.id,
    });
  });
