import { eq } from 'drizzle-orm';

import type { NewUserDef } from '../schema';

import { db } from '../index';
import { usersDbSchema } from '../schema';

export const getAllUsers = async () => {
  return await db.select().from(usersDbSchema);
};

export const getUser = async (id: number) => {
  return await db.select().from(usersDbSchema).where(eq(usersDbSchema.id, id));
};

export const createUser = async (user: NewUserDef) => {
  const [newUser] = await db
    .insert(usersDbSchema)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return newUser;
};
