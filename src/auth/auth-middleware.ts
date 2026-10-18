import { createMiddleware } from '@tanstack/react-start';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import type { AuthContextDef } from './auth-middleware.types';

import { authSchema } from './auth-middleware.schema';
import { getUserContext } from './auth.functions';

/** Use this middleware to authenticate protected API routes. */
export const authApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const userContext = await getUserContext();

    if (!userContext) {
      const unauthorizedMsg = ReasonPhrases.UNAUTHORIZED;

      console.error({
        message: unauthorizedMsg,
        status: StatusCodes.UNAUTHORIZED,
      });

      throw new Error(unauthorizedMsg);
    }

    const { data, error, success } = authSchema.safeParse(userContext);

    if (success) {
      const context: AuthContextDef = {
        user: data,
      };

      return await next({
        context,
      });
    }

    const unprocessableMsg = ReasonPhrases.UNPROCESSABLE_ENTITY;

    console.error({
      error,
      message: unprocessableMsg,
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    });

    throw new Error(unprocessableMsg);
  },
);

/** Use this middleware to authenticate unprotected API routes. Will try to authorize, but won't throw an error if it fails (unless the response is malformed). */
export const softAuthApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const userContext = await getUserContext();

    if (!userContext) {
      return await next({
        context: {
          user: {},
        } as unknown as AuthContextDef,
      });
    }

    const { data, error, success } = authSchema.safeParse(userContext);

    if (success) {
      const context: AuthContextDef = {
        user: data,
      };

      return await next({
        context,
      });
    }

    const unprocessableMsg = ReasonPhrases.UNPROCESSABLE_ENTITY;

    console.error({
      error,
      message: unprocessableMsg,
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    });

    throw new Error(unprocessableMsg);
  },
);

export const errorHandlingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  try {
    // Executes downstream middleware and the server function itself
    return await next();
  } catch (error) {
    console.error('Error captured by middleware:', error);

    throw error;
  }
});
