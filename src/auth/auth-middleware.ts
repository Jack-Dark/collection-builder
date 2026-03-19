import { createMiddleware } from '@tanstack/react-start';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { getUserContext } from './auth.functions';

/** Use this middleware to authenticate protected API routes. */
export const authApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await getUserContext();

    if (!user) {
      return new Response(
        JSON.stringify({ error: getReasonPhrase(StatusCodes.UNAUTHORIZED) }),
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    return await next({
      context: {
        user,
      },
    });
  },
);
