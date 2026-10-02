import { createMiddleware } from '@tanstack/react-start';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import z from 'zod';

import { getUserContext } from './auth.functions';

const authSchema = z
  .object({
    id: z.string().describe('User ID'),
    image: z.string().describe('User image').nullable().optional(),
    name: z.string().describe('User name'),
    token: z.string().describe('User token'),
  })
  .describe('User context');

/** Use this middleware to authenticate protected API routes. */
export const authApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    // try {
    const userContext = await getUserContext();

    if (!userContext) {
      const unauthorizedMsg = getReasonPhrase(StatusCodes.UNAUTHORIZED);

      console.error({
        message: unauthorizedMsg,
        status: StatusCodes.UNAUTHORIZED,
      });

      throw new Error(unauthorizedMsg);
    }

    const { data, error, success } = z.safeParse(authSchema, userContext);

    if (success) {
      return await next({
        context: {
          user: data,
        },
      });
    }

    const unprocessableMsg = getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY);

    console.error({
      error,
      message: unprocessableMsg,
      status: StatusCodes.UNPROCESSABLE_ENTITY,
    });

    throw new Error(unprocessableMsg);
    // } catch (error: unknown) {
    //   console.error('Auth server function error caught:', error);

    //   return await next({
    //     context: {
    //       user: {
    //         id: '',
    //         image: null,
    //         name: '',
    //         token: '',
    //       },
    //     },
    //   });
    // }
  },
);

export const errorHandlingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  try {
    // Executes downstream middleware and the server function itself
    return await next();
  } catch (error) {
    // 1. Log the error to your monitoring infrastructure (e.g., Sentry)
    console.error('Server function error caught:', error);

    // 2. Intercept and safely reshape the error before it hits the client
    if (error instanceof z.ZodError) {
      throw Response.json(
        { message: 'Data validation failure occurred' },
        { status: 500 },
      );
    }

    // Otherwise, bubble up the original error
    throw error;
  }
});
