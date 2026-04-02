import { db } from '#/api/db';
import { and, desc, eq, isNull } from 'drizzle-orm';

import type { NewGameRecordDef, UpdateGameRecordDef } from './types';

import { games } from '../../../schema';

const getMatchesUserIdAndNotDeleted = (userId: string | undefined) => {
  return and(eq(games.userId, userId!), isNull(games.deletedAt));
};

export const getAllGames = async (userId: string | undefined) => {
  if (userId) {
    return await db
      .select()
      .from(games)
      .where(getMatchesUserIdAndNotDeleted(userId));
  }

  return [];
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
      .where(and(eq(games.id, id), getMatchesUserIdAndNotDeleted(userId)));

    return game;
  }
};
export const getLastAddedGamesSystem = async (userId: string | undefined) => {
  if (userId) {
    const [game] = await db
      .select({ system: games.system })
      .from(games)
      .where(getMatchesUserIdAndNotDeleted(userId))
      .orderBy(desc(games.createdAt))
      .limit(1);

    return game?.system;
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

export const createMockGames = async (mockGames: NewGameRecordDef[]) => {
  await db.insert(games).values(mockGames).onConflictDoNothing();
};

export const updateGameById = async (props: {
  game: UpdateGameRecordDef;
  userId: string | undefined;
}) => {
  const { game, userId } = props;
  // TODO - PROBABLY HAVE TO MERGE OLD AND NEW DATA. GET GAME BY ID, IF NEEDED
  const [updatedGame] = await db
    .update(games)
    .set({ ...game, updatedAt: new Date() })
    .where(and(eq(games.id, game.id), getMatchesUserIdAndNotDeleted(userId)))
    .returning();

  return updatedGame;
};

export const softDeleteGameById = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;

  await db
    .update(games)
    .set({ deletedAt: new Date() })
    .where(and(eq(games.id, id), getMatchesUserIdAndNotDeleted(userId)));
};

export const hardDeleteGameById = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;

  await db
    .delete(games)
    .where(and(eq(games.id, id), getMatchesUserIdAndNotDeleted(userId)));
};
export const hardDeleteAllGamesByUser = async (userId: string) => {
  await db.delete(games).where(getMatchesUserIdAndNotDeleted(userId));
};
