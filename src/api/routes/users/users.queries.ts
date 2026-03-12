import { eq } from 'drizzle-orm';

import type { NewUserRecordDef } from './users.types';

import { db } from '../../index';
import { usersTable } from './users.schema';

export const getAllUsers = async () => {
  return await db.select().from(usersTable);
};

export const getUser = async (id: number) => {
  return await db.select().from(usersTable).where(eq(usersTable.id, id));
};

export const createUser = async (user: NewUserRecordDef) => {
  const [newUser] = await db
    .insert(usersTable)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return newUser;
};
