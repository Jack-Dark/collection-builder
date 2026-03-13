import { like } from 'drizzle-orm';

import type { NewUserRecordDef } from './types';

import { db } from '../../../db';
import { usersTable } from './schema';

export const getAllUsers = async () => {
  return await db.select().from(usersTable);
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(like(usersTable.email, `%${email}%`));

  return user;
};

export const createUser = async (user: NewUserRecordDef) => {
  const [newUser] = await db
    .insert(usersTable)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return newUser;
};
