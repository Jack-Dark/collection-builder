import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import type { UpdateCollectionItemRecordDef } from '#/api/routes/collection-items/server/types';

import { gamesDbQueries } from '#/api/routes/collection-items/server';
import { collectionsDbQueries } from '#/api/routes/collections/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collections/$id/')({
  server: {
    handlers: {
      DELETE: async ({ context, params }) => {
        const id = Number(params.id);

        await gamesDbQueries.softDeleteCollectionItemByIdQuery({
          id,
          userId: context.user.id,
        });

        return Response.json({ message: 'Collection deleted successfully' });
      },
      GET: async ({ params }) => {
        const id = Number(params.id);

        const data = await getCollectionById({ data: { id } });

        if (!data) {
          return Response.json({});
        }

        return Response.json(data);
      },
      PUT: async ({ context, params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: UpdateCollectionItemRecordDef = await request.json();

        const updatedRecord = await gamesDbQueries.updateCollectionItemQuery({
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
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ context, data: params }) => {
    return collectionsDbQueries.getCollectionById({
      id: params.id,
      userId: context.user.id,
    });
  });

export const getItemsByCollectionId = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(z.object({ collectionId: z.number() }))
  .handler(async ({ context, data: params }) => {
    return gamesDbQueries.getItemsByCollectionIdQuery({
      collectionId: params.collectionId,
      userId: context.user.id,
    });
  });
