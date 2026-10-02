import { createMiddleware } from '@tanstack/react-start';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
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
    const userContext = await getUserContext();

    if (!userContext) {
      const unauthorizedMsg = ReasonPhrases.UNAUTHORIZED;

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
