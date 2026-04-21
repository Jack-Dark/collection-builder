import type { updateCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';
import type z from 'zod';

import { createFileRoute } from '@tanstack/react-router';
import {
  deleteCollectionItemServerFn,
  getCollectionItemServerFn,
  updateCollectionItemSeverFn,
} from '#/api/routes/collection-items/server/serverFns';
import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import { ReasonPhrases } from 'http-status-codes';

export const Route = createFileRoute('/api/collection-items/$id')({
  server: {
    handlers: {
      DELETE: async ({ params }) => {
        const id = Number(params.id);

        await deleteCollectionItemServerFn({
          data: id,
        });

        return Response.json({
          message: 'Item deleted successfully',
        });
      },
      GET: async ({ params }) => {
        const id = Number(params.id);

        const updatedRecord = await getCollectionItemServerFn({
          data: id,
        });

        return Response.json(updatedRecord);
      },
      PUT: async ({ params, request }) => {
        const id = Number(params.id);
        // Access the request body, for example, a JSON body
        const gameDetails: z.Infer<typeof updateCollectionItemSchema> =
          await request.json();

        if (id === gameDetails.id) {
          const updatedRecord = await updateCollectionItemSeverFn({
            data: gameDetails,
          });

          return Response.json(updatedRecord);
        }
        throw new Error(ReasonPhrases.CONFLICT, {
          cause: 'This submitted ID does not match the record ID.',
        });
      },
    },
    middleware: [authApiRouteMiddleware],
  },
});
