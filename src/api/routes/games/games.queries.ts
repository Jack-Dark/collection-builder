import { and, eq, isNull } from 'drizzle-orm';

import type { NewGameRecordDef } from './games.types';

import { db } from '../../db';
import { gamesTable } from './games.schema';

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

export const createGame = async (game: NewGameRecordDef) => {
  const [newGame] = await db
    .insert(gamesTable)
    .values(game)
    .onConflictDoNothing()
    .returning();

  return newGame;
};

export const updateGameById = async (
  id: number,
  game: Partial<Omit<NewGameRecordDef, 'id'>>,
) => {
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
