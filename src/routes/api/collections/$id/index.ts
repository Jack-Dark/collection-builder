import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import type { UpdateCollectionItemRecordDef } from '#/api/routes/collection-items/server/types';

import { sortDirectionOptions } from '#/api/pagination/constants';
import { collectionItemsDbQueries } from '#/api/routes/collection-items/server';
import { collectionsDbQueries } from '#/api/routes/collections/server';
import { requireCollectionIdSchema } from '#/api/routes/collections/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collections/$id/')({
  server: {
    handlers: {
      DELETE: async ({ context, params }) => {
        const id = Number(params.id);

        await collectionItemsDbQueries.softDeleteCollectionItemByIdQuery({
          id,
          userId: context.user.id,
        });

        return Response.json({ message: 'Collection deleted successfully' });
      },
      GET: async ({ params }) => {
        const id = Number(params.id);

        const data = await getCollectionById({ data: { collectionId: id } });

        if (!data) {
          return Response.json({});
        }

        return Response.json(data);
      },
      PUT: async ({ context, params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: UpdateCollectionItemRecordDef = await request.json();

        const updatedRecord =
          await collectionItemsDbQueries.updateCollectionItemQuery({
            ...gameDetails,
            id,
            userId: context.user.id,
          });

        return Response.json(updatedRecord);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});

export const getCollectionById = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(requireCollectionIdSchema)
  .handler(async ({ context, data: { collectionId } }) => {
    return collectionsDbQueries.getCollectionById({
      id: collectionId,
      userId: context.user.id,
    });
  });

export const getItemsByCollectionId = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .validator(
    requireCollectionIdSchema.extend({
      params: z
        .object({
          sortDirection: z
            .union([
              z.literal(sortDirectionOptions.asc),
              z.literal(sortDirectionOptions.desc),
            ])
            .optional(),
          sortField: z
            .union([
              z.literal('id'),
              z.literal('name'),
              z.literal('createdAt'),
              z.literal('updatedAt'),
              z.literal('userId'),
              z.literal('collectionId'),
              z.literal('notes'),
              z.literal('deletedAt'),
              z.literal('isSpecialEdition'),
              z.literal('editionDetails'),
              z.literal('customField1Value'),
              z.literal('customField2Value'),
              z.literal('customField3Value'),
            ])
            .optional(),
        })
        .optional(),
    }),
  )
  .handler(async ({ context, data: { collectionId, params } }) => {
    return collectionItemsDbQueries.getItemsByCollectionIdQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });
