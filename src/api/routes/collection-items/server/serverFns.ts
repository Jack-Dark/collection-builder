import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { collectionItemsDbQueries } from '.';
import { requireCollectionIdSchema } from '../../collections/server/serverFns';

const createCollectionItemBaseSchema = z.object({
  collectionId: z.number().describe('Collection ID'),
  customField1Value: z.string().describe('[customField1Value] placeholder'),
  customField2Value: z.string().describe('[customField2Value] placeholder'),
  customField3Value: z.string().describe('[customField3Value] placeholder'),
  editionDetails: z.string().describe('Edition details'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
});

const createCollectionItemIsSpecialEditionSchema = z.object({
  ...createCollectionItemBaseSchema.shape,
  editionDetails: createCollectionItemBaseSchema.shape.editionDetails
    .min(1)
    .describe('Edition details'),
  isSpecialEdition: z.literal(true).describe('Is special edition'),
});

const createCollectionItemIsNotSpecialEditionSchema = z.object({
  ...createCollectionItemBaseSchema.shape,
  editionDetails: z.literal('').describe('Edition details'),
  isSpecialEdition: z.literal(false).describe('Is special edition'),
});

const requireCollectionItemIdSchema = z.object({
  collectionItemId: z.number(),
});

export const createCollectionItemSchema = z.union([
  createCollectionItemIsSpecialEditionSchema,
  createCollectionItemIsNotSpecialEditionSchema,
]);

export const updateCollectionItemSchema = z.object({
  customField1Value: z.string().describe('System').min(1).nullable(),
  editionDetails: z.string().describe('Edition details').nullable(),
  id: z.number().min(1),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  userId: z.string(),
});

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(createCollectionItemSchema)
  .handler(async ({ context, data }) => {
    return collectionItemsDbQueries.createCollectionItemQuery({
      ...data,
      userId: context.user.id,
    });
  });

export const getCollectionItemServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(requireCollectionItemIdSchema)
  .handler(async ({ context, data: { collectionItemId } }) => {
    return collectionItemsDbQueries.getCollectionItemByIdQuery({
      collectionItemId,
      userId: context.user.id,
    });
  });

export const getCustomFieldsSetsForCollectionIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return collectionItemsDbQueries.getCustomFieldsSetsForCollectionIdQuery({
      collectionId,
      userId: context.user.id,
    });
  });

export const updateCollectionItemSeverFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(updateCollectionItemSchema)
  .handler(async ({ data }) => {
    return collectionItemsDbQueries.updateCollectionItemQuery(data);
  });

export const deleteCollectionItemServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(requireCollectionItemIdSchema)
  .handler(async ({ context, data: { collectionItemId } }) => {
    return collectionItemsDbQueries.softDeleteCollectionItemByIdQuery({
      id: collectionItemId,
      userId: context.user.id,
    });
  });
