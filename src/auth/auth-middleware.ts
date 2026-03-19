import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { auth } from './auth';

/** Use this middleware to authenticate protected API routes. */
export const authErrorMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const user = await getUserContext(request);

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

/** Use this middleware to authenticate protected page routes. */
export const authRedirectMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const user = await getUserContext(request);

    if (!user) {
      throw redirect({ to: '/sign-in' });
    }

    return await next({
      context: {
        user,
      },
    });
  },
);

const getUserContext = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    return {
      id: session?.user.id,
      image: session?.user.image,
      name: session?.user.name,
    };
  }
};
