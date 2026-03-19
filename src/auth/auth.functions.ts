import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from './auth';

export const getUserContext = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({
      headers,
    });

    if (session) {
      return {
        id: session?.user.id,
        image: session?.user.image,
        name: session?.user.name,
      };
    }
  },
);
