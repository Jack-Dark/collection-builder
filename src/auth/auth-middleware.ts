import { createMiddleware } from '@tanstack/react-start';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import z from 'zod';

import { getUserContext } from './auth.functions';

const authSchema = z.object({
  id: z.string(),
  image: z.string().nullable().optional(),
  name: z.string(),
  token: z.string(),
});

const unauthorizedMsg = getReasonPhrase(StatusCodes.UNAUTHORIZED);

/** Use this middleware to authenticate protected API routes. */
export const authApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const userContext = await getUserContext();

    if (!userContext) {
      return new Response(
        JSON.stringify({ error: { message: unauthorizedMsg } }),
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    const { data, error, success } = z.safeParse(authSchema, userContext);

    if (success) {
      return await next({
        context: {
          user: data,
        },
      });
    } else {
      return new Response(JSON.stringify({ error }), {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
  },
);
