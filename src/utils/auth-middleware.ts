import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from './auth';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await getRequestHeaders(),
  });

  return await next({
    context: {
      user: {
        id: session?.user.id,
        image: session?.user.image,
        name: session?.user.name,
      },
    },
  });
});
