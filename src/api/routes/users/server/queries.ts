import { db } from '#/api/db';
import { and, eq, isNull } from 'drizzle-orm';

import type { NewUserRecordDef, UpdateUserRecordDef } from './types';

import { usersTable } from './schema';

export const getAllUsers = async () => {
  return await db.select().from(usersTable).where(isNull(usersTable.deletedAt));
};

export const getUserById = async (id: number) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)));

  return user;
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  return user;
};

export const createUser = async (userDetails: NewUserRecordDef) => {
  const [newUser] = await db
    .insert(usersTable)
    .values(userDetails)
    .onConflictDoNothing()
    .returning();

  return newUser;
};

export const updateUserById = async (id: number, user: UpdateUserRecordDef) => {
  // TODO - PROBABLY HAVE TO MERGE OLD AND NEW DATA. GET GAME BY ID, IF NEEDED
  const [updatedUser] = await db
    .update(usersTable)
    .set({ ...user, updatedAt: new Date() })
    .where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)))
    .returning();

  return updatedUser;
};

export const deleteUserById = async (id: number) => {
  await db.delete(usersTable).where(eq(usersTable.id, id));
};
