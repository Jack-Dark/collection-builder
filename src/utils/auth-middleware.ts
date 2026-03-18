import { createMiddleware } from '@tanstack/react-start';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { auth } from './auth';

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(
        JSON.stringify({ error: getReasonPhrase(StatusCodes.UNAUTHORIZED) }),
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    return await next({
      context: {
        user: {
          id: session.user.id,
          image: session.user.image,
          name: session.user.name,
        },
      },
    });
  },
);
