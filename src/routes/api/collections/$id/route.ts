import type { UpdateGameRecordDef } from '#/api/routes/games/server/types';

import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { collectionsDbQueries } from '#/api/routes/collections/server';
import { gamesDbQueries } from '#/api/routes/games/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import z from 'zod';

export const Route = createFileRoute('/api/collections/$id')({
  server: {
    handlers: {
      DELETE: async ({ context, params }) => {
        const id = Number(params.id);

        await gamesDbQueries.softDeleteGameById({
          id,
          userId: context.user.id,
        });

        return Response.json({ message: 'Game deleted successfully' });
      },
      GET: async ({ params }) => {
        const id = Number(params.id);

        const data = await fetchCollectionById({ data: { id } });

        if (!data) {
          return Response.json({});
        }

        return Response.json(data);
      },
      PUT: async ({ context, params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: UpdateGameRecordDef = await request.json();

        const updatedGame = await gamesDbQueries.updateGameById({
          game: { ...gameDetails, id },
          userId: context.user.id,
        });

        return Response.json(updatedGame);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});

export const fetchCollectionById = createServerFn({
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

export const fetchItemsByCollectionId = createServerFn({
  method: 'GET',
})
  .middleware([authApiRouteMiddleware])
  .inputValidator(z.object({ collectionId: z.number() }))
  .handler(async ({ context, data: params }) => {
    return gamesDbQueries.getItemsByCollectionId({
      collectionId: params.collectionId,
      userId: context.user.id,
    });
  });
