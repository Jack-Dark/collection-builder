import { createServerFn } from '@tanstack/react-start';
import { getOptionalPaginationParamsSchema } from '#/api/pagination/schema';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import * as zod from 'zod';

import type { CollectionRecordDef } from './types';

import { collectionsDbQueries } from '.';

const nameSchema = zod.string().describe('Name').min(1);
const userIdSchema = zod.string().describe('User ID').min(1);

export const createCollectionSchema = zod.object({
  name: nameSchema,
});

export const updateCollectionSchema = zod.object({
  id: zod.number().describe('ID').min(1),
  name: nameSchema,
  userId: userIdSchema,
});

const allCollectionsSortFields = [
  'name',
  'createdAt',
] satisfies (keyof CollectionRecordDef)[];

export const allCollectionsPaginationParamsSchema =
  getOptionalPaginationParamsSchema(allCollectionsSortFields);

export const fetchAllCollectionsServerFn = createServerFn({
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
  .inputValidator(zod.number())
  .handler(async ({ context, data: id }) => {
    return collectionsDbQueries.getCollectionById({
      id,
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
  .inputValidator(zod.number())
  .handler(async ({ context, data: id }) => {
    return collectionsDbQueries.softDeleteCollection({
      id,
      userId: context.user.id,
    });
  });
