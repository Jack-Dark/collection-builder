import { createServerFn } from '@tanstack/react-start';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import z from 'zod';

import { gamesDbQueries } from '.';

const createCollectionItemBaseSchema = z.object({
  editionDetails: z.string().describe('Edition details'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  system: z.string().describe('System').min(1),
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

export const createCollectionItemSchema = z.union([
  createCollectionItemIsSpecialEditionSchema,
  createCollectionItemIsNotSpecialEditionSchema,
]);

export const updateCollectionItemSchema = z.object({
  editionDetails: z.string().describe('Edition details'),
  id: z.number().min(1),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  system: z.string().describe('System').min(1),
  userId: z.string(),
});

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(createCollectionItemSchema)
  .handler(async ({ context, data }) => {
    return gamesDbQueries.createGame({
      ...data,
      userId: context.user.id,
    });
  });

export const getCollectionItemServerFn = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(z.number())
  .handler(async ({ context, data: id }) => {
    return gamesDbQueries.getGameById({ id, userId: context.user.id });
  });

export const updateCollectionItemSeverFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via PUT
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(updateCollectionItemSchema)
  .handler(async ({ data }) => {
    return gamesDbQueries.updateCollectionItem(data);
  });

export const deleteCollectionItemServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(z.number())
  .handler(async ({ context, data: id }) => {
    return gamesDbQueries.softDeleteGameById({ id, userId: context.user.id });
  });
