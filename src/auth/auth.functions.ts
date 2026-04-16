import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from './auth';

export const getUserContext = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders();
    const data = await auth.api.getSession({
      headers,
    });

    if (data) {
      return {
        id: data?.user.id,
        image: data?.user.image,
        name: data?.user.name,
        token: data?.session.token,
      };
    }
  },
);
