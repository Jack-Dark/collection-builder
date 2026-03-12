import { eq } from 'drizzle-orm';

import type { NewGameRecordDef } from './games.types';

import { db } from '../../index';
import { gamesTable } from './games.schema';

export const getAllGames = async () => {
  return await db.select().from(gamesTable);
};

export const getGame = async (id: number) => {
  return await db.select().from(gamesTable).where(eq(gamesTable.id, id));
};

export const createGame = async (Game: NewGameRecordDef) => {
  const [newGame] = await db
    .insert(gamesTable)
    .values(Game)
    .onConflictDoNothing()
    .returning();

  return newGame;
};
