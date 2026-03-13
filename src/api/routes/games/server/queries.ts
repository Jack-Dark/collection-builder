import { db } from '#/api/db';
import { and, eq, isNull } from 'drizzle-orm';

import type { NewGameRecordDef, UpdateGameRecordDef } from './types';

import { gamesTable } from './schema';

export const getAllGames = async () => {
  return await db.select().from(gamesTable).where(isNull(gamesTable.deletedAt));
};

export const getGameById = async (id: number) => {
  const [game] = await db
    .select()
    .from(gamesTable)
    .where(and(eq(gamesTable.id, id), isNull(gamesTable.deletedAt)));

  return game;
};

export const createGame = async (gameDetails: NewGameRecordDef) => {
  const [newGame] = await db
    .insert(gamesTable)
    .values(gameDetails)
    .onConflictDoNothing()
    .returning();

  return newGame;
};

export const updateGameById = async (
  id: number,
  game: Partial<UpdateGameRecordDef>,
) => {
  // TODO - PROBABLY HAVE TO MERGE OLD AND NEW DATA. GET GAME BY ID, IF NEEDED
  const [updatedGame] = await db
    .update(gamesTable)
    .set({ ...game, updatedAt: new Date() })
    .where(and(eq(gamesTable.id, id), isNull(gamesTable.deletedAt)))
    .returning();

  return updatedGame;
};

export const deleteGameById = async (id: number) => {
  await db
    .update(gamesTable)
    .set({ deletedAt: new Date() })
    .where(eq(gamesTable.id, id));
};
