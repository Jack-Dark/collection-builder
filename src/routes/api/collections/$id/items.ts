import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { gamesDbQueries } from '#/api/routes/collection-items/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

export const Route = createFileRoute('/api/collections/$id/items')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const collectionId = Number(params.id);

        const data = await fetchItemsByCollectionId({ data: { collectionId } });

        if (!data) {
          return Response.json({});
        }

        return Response.json(data);
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});

export const fetchItemsByCollectionId = createServerFn({
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
