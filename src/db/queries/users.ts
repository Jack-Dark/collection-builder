import { eq } from 'drizzle-orm';

import { db } from '../index';
import { usersDbSchema, type NewUserDef } from '../schema';

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
