import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';

import type { GetUsersRequestArgsDef } from './get-users.types';

export const getUsersDbQuery = async (
  props?: DbQueryArgsDef<GetUsersRequestArgsDef>,
) => {
  const users = await db.query.users.findMany({
    with: {
      sessions: {
        columns: {
          updatedAt: true,
        },
        limit: 1,
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  });

  const formattedUsers = users.map(({ sessions, ...user }) => {
    return { ...user, lastSession: sessions[0]?.updatedAt };
  });

  return { users: formattedUsers };
};
