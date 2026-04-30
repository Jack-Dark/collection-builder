import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { getOptionalPaginationParamsSchema } from '#/api/pagination/schema';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import type { CollectionRecordDef } from './types';

import { collectionsDbQueries } from '.';
import { collectionItemsDbQueries } from '../../collection-items/server';

const nameSchema = z.string().describe('Name').min(1);
const notesSchema = z.string().describe('Notes');
const userIdSchema = z.string().describe('User ID').min(1);

const getCustomFieldEnabledSchema = (num: number) => {
  return z.boolean().describe(`Custom Field ${num} Enabled`);
};
const getCustomFieldLabelSchema = (num: number) => {
  return z.string().nullable().describe(`Custom Field ${num} Label`);
};
const getCustomFieldRequiredSchema = (num: number) => {
  return z.boolean().describe(`Custom Field ${num} Required`);
};

export const createCollectionSchema = z.object({
  customField1Enabled: getCustomFieldEnabledSchema(1),
  customField1Label: getCustomFieldLabelSchema(1),
  customField1Required: getCustomFieldRequiredSchema(1),
  customField2Enabled: getCustomFieldEnabledSchema(2),
  customField2Label: getCustomFieldLabelSchema(2),
  customField2Required: getCustomFieldRequiredSchema(2),
  customField3Enabled: getCustomFieldEnabledSchema(3),
  customField3Label: getCustomFieldLabelSchema(3),
  customField3Required: getCustomFieldRequiredSchema(3),
  name: nameSchema,
  notes: notesSchema,
});

export const updateCollectionSchema = z.object({
  customField1Enabled: getCustomFieldEnabledSchema(1),
  customField1Label: getCustomFieldLabelSchema(1),
  customField1Required: getCustomFieldRequiredSchema(1),
  customField2Enabled: getCustomFieldEnabledSchema(2),
  customField2Label: getCustomFieldLabelSchema(2),
  customField2Required: getCustomFieldRequiredSchema(2),
  customField3Enabled: getCustomFieldEnabledSchema(3),
  customField3Label: getCustomFieldLabelSchema(3),
  customField3Required: getCustomFieldRequiredSchema(3),
  id: z.number().describe('ID').min(1),
  name: nameSchema,
  notes: notesSchema,
  userId: userIdSchema,
});

export const requireCollectionIdSchema = z.object({
  collectionId: z.number(),
});

const allCollectionsSortFields = [
  'name',
  'createdAt',
] satisfies (keyof CollectionRecordDef)[];

export const allCollectionsPaginationParamsSchema =
  getOptionalPaginationParamsSchema(allCollectionsSortFields);

export const getAllCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(allCollectionsPaginationParamsSchema)
  .handler(async ({ context, data: params }) => {
    return collectionsDbQueries.getAllCollections({
      params,
      userId: context.user.id,
    });
  });

export const createCollectionServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(createCollectionSchema)
  .handler(async ({ context, data }) => {
    return collectionsDbQueries.createCollection({
      ...data,
      userId: context.user.id,
    });
  });

export const getCollectionServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return collectionsDbQueries.getCollectionById({
      id: collectionId,
      userId: context.user.id,
    });
  });

export const getLastAddedItemInCollectionIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return collectionItemsDbQueries.getLastAddedCollectionItemQuery({
      collectionId,
      userId: context.user.id,
    });
  });

export const updateCollectionSeverFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(updateCollectionSchema)
  .handler(async ({ data }) => {
    return collectionsDbQueries.updateCollection(data);
  });

export const deleteCollectionServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return collectionsDbQueries.softDeleteCollection({
      id: collectionId,
      userId: context.user.id,
    });
  });
