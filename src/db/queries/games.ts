import { eq } from 'drizzle-orm';

import type { NewGameDef } from '../schema';

import { db } from '../index';
import { gamesDbSchema } from '../schema';

export const getAllGames = async () => {
  return await db.select().from(gamesDbSchema);
};

export const getGame = async (id: number) => {
  return await db.select().from(gamesDbSchema).where(eq(gamesDbSchema.id, id));
};

export const createGame = async (Game: NewGameDef) => {
  const [newGame] = await db
    .insert(gamesDbSchema)
    .values(Game)
    .onConflictDoNothing()
    .returning();

  return newGame;
};
