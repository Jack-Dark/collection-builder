import { db } from '#/api/db';
import { and, desc, eq, isNull } from 'drizzle-orm';

import type { NewGameRecordDef, UpdateGameRecordDef } from './types';

import { games } from '../../../schema';

// TODO - ADD QUERY BY USER ID VIA AUTH ENDPOINT

export const getAllGames = async (userId: string | undefined) => {
  if (userId) {
    return await db
      .select()
      .from(games)
      .where(and(eq(games.userId, userId), isNull(games.deletedAt)));
  }
};

export const getGameById = async (props: {
  userId: string | undefined;
  id: number;
}) => {
  const { id, userId } = props;
  if (userId) {
    const [game] = await db
      .select()
      .from(games)
      .where(
        and(
          eq(games.id, id),
          eq(games.userId, userId),
          isNull(games.deletedAt),
        ),
      );

    return game;
  }
};
export const getLastAddedGame = async (userId: string | undefined) => {
  if (userId) {
    const [game] = await db
      .select()
      .from(games)
      .where(and(eq(games.userId, userId), isNull(games.deletedAt)))
      .orderBy(desc(games.createdAt))
      .limit(1);

    return game;
  }
};

export const createGame = async (gameDetails: NewGameRecordDef) => {
  const [newGame] = await db
    .insert(games)
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
    .update(games)
    .set({ ...game, updatedAt: new Date() })
    .where(and(eq(games.id, id), isNull(games.deletedAt)))
    .returning();

  return updatedGame;
};

export const deleteGameById = async (id: number) => {
  await db.update(games).set({ deletedAt: new Date() }).where(eq(games.id, id));
};
