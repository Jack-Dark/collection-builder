import type {
  getGameById,
  createGame,
  updateGameById,
} from '#/api/routes/games/games.queries';

import { createServerFn } from '@tanstack/react-start';
import { getAllGames } from '#/api/routes/games/games.queries';
import { configs } from '#/configs';
import * as zod from 'zod';

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

// // TODO - move into page route logic
// export const create = createServerFn({
//   method: 'POST',
// })
//   .inputValidator(createSchema)
//   .handler(async ({ data }) => {
//     // TODO - ADD AUTHENTICATED USER ID LOGIC
//     return createGame(data);
//   });

// export const create = createGame;

export const getAll = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllGames();
});

export const create = async (game: Parameters<typeof createGame>[0]) => {
  const url = `${configs.hostUrl}api/games`;
  console.log('🚀 ~ FETCH create ~ url:', url);

  try {
    const response = await fetch(url, {
      body: JSON.stringify(game),
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: ReturnType<typeof createGame> = await response.json();

    return result;
  } catch (error) {
    // TODO - fix
    // @ts-expect-error
    console.error(error.message);
  }
};
export const updateById = async (
  ...args: Parameters<typeof updateGameById>
) => {
  const [id, gameDetails] = args;
  const url = `${configs.hostUrl}api/games/${id}`;
  try {
    const response = await fetch(url, {
      body: JSON.stringify(gameDetails),
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: ReturnType<typeof updateGameById> = await response.json();

    return result;
  } catch (error) {
    // TODO - fix
    // @ts-expect-error
    console.error(error.message);
  }
};
export const deleteById = async (id: number) => {
  const url = `${configs.hostUrl}api/games/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    // TODO - fix
    // @ts-expect-error
    console.error(error.message);
  }
};

export const getById = async (id: number) => {
  const url = `${configs.hostUrl}api/games/${id}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result: ReturnType<typeof getGameById> = await response.json();

    return result;
  } catch (error) {
    // TODO - fix
    // @ts-expect-error
    console.error(error.message);
  }
};

// export const updateById = updateGame;
