import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { collectionItemsDbQueries } from '#/api/routes/collection-items/server';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';

import { collectionItemsSearchQueriesSchema } from '.';

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
  .validator(
    z.object({
      collectionId: z.number(),
      params: collectionItemsSearchQueriesSchema,
    }),
  )
  .handler(async ({ context, data: { collectionId, params } }) => {
    return collectionItemsDbQueries.getItemsByCollectionIdQuery({
      collectionId,
      params,
      userId: context.user.id,
    });
  });
