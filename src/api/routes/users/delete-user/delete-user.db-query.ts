import { eq } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { usersTable } from '#/api/db-tables-schema';

import type { DeleteUserRequestArgsDef } from './delete-user.types';

export const deleteUserDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<DeleteUserRequestArgsDef>) => {
  const userId = context.user.id;

  await db.delete(usersTable).where(eq(usersTable.id, userId));
};
