import type { RouterPath } from '#/types';

import * as zod from 'zod';

import type {
  GameRecordDef,
  NewGameRecordDef,
  UpdateGameRecordDef,
} from '../server/types';

const createBaseSchema = zod.object({
  editionDetails: zod.string().describe('Edition details'),
  isSpecialEdition: zod.boolean().describe('Is special edition'),
  name: zod.string().describe('Name').min(1),
  system: zod.string().describe('System').min(1),
});

const createIsSpecialEditionSchema = zod.object({
  ...createBaseSchema.shape,
  editionDetails: createBaseSchema.shape.editionDetails
    .min(1)
    .describe('Edition details'),
  isSpecialEdition: zod.literal(true).describe('Is special edition'),
});

const createIsNotSpecialEditionSchema = zod.object({
  ...createBaseSchema.shape,
  editionDetails: zod.literal('').describe('Edition details'),
  isSpecialEdition: zod.literal(false).describe('Is special edition'),
});

export const createSchema = zod.union([
  createIsSpecialEditionSchema,
  createIsNotSpecialEditionSchema,
]);

export const create = async (game: NewGameRecordDef) => {
  const url: RouterPath = `/api/games`;

  try {
    const response = await fetch(url, {
      body: JSON.stringify(game),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: GameRecordDef = await response.json();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const createMockGames = async (userId: string) => {
  const url = `/api/games/mock-data/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
export const deleteAllGames = async (userId: string) => {
  const url = `/api/games/mock-data/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const updateById = async (
  id: number,
  gameDetails: UpdateGameRecordDef,
) => {
  const url = `/api/games/${id}`;
  try {
    const response = await fetch(url, {
      body: JSON.stringify(gameDetails),
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: GameRecordDef = await response.json();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const deleteById = async (id: number) => {
  const url = `/api/games/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const getById = async (id: number) => {
  const url = `/api/games/${id}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: GameRecordDef = await response.json();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
