import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { optionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import {
  createCollection,
  getAllCollections,
  getCollectionById,
  softDeleteCollection,
  updateCollection,
} from './queries';

const getCustomFieldEnabledSchema = (num: number) => {
  return z.boolean().describe(`Custom Field ${num} Enabled`);
};
const getCustomFieldLabelSchema = (num: number) => {
  return z.string().nullable().describe(`Custom Field ${num} Label`);
};
const getCustomFieldRequiredSchema = (num: number) => {
  return z.boolean().describe(`Custom Field ${num} Required`);
};

export const baseCollectionSchema = z.object({
  customField1Enabled: getCustomFieldEnabledSchema(1),
  customField1Label: getCustomFieldLabelSchema(1),
  customField1Required: getCustomFieldRequiredSchema(1),
  customField2Enabled: getCustomFieldEnabledSchema(2),
  customField2Label: getCustomFieldLabelSchema(2),
  customField2Required: getCustomFieldRequiredSchema(2),
  customField3Enabled: getCustomFieldEnabledSchema(3),
  customField3Label: getCustomFieldLabelSchema(3),
  customField3Required: getCustomFieldRequiredSchema(3),
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

export const collectionFormSchema = baseCollectionSchema.and(
  z.union([createItemSchema, updateItemSchema]),
);

export const createCollectionSchema = baseCollectionSchema.extend(
  createItemSchema.shape,
);

export const updateCollectionSchema = baseCollectionSchema.extend(
  updateItemSchema.shape,
);

export const getAllCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(optionalPaginationQueriesSchema)
  .handler(async ({ context, data: params }) => {
    return getAllCollections({
      params,
      userId: context.user.id,
    });
  });

export const createCollectionServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(createCollectionSchema)
  .handler(async ({ context, data }) => {
    return createCollection({
      ...data,
      userId: context.user.id,
    });
  });

export const requireCollectionIdSchema = z.object({
  collectionId: z.number(),
});

export const getCollectionServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return getCollectionById({
      id: collectionId,
      userId: context.user.id,
    });
  });

export const updateCollectionServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(updateCollectionSchema)
  .handler(async ({ data }) => {
    return updateCollection(data);
  });

export const deleteCollectionServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return softDeleteCollection({
      id: collectionId,
      userId: context.user.id,
    });
  });
