import { like } from 'drizzle-orm';

import type { NewGameRecordDef } from './games.types';

import { db } from '../../index';
import { gamesTable } from './games.schema';

export const getAllGames = async () => {
  return await db.select().from(gamesTable);
};

export const getGameByName = async (name: string) => {
  const [game] = await db
    .select()
    .from(gamesTable)
    .where(like(gamesTable.name, `%${name}%`));

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
