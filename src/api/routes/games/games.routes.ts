import { createServerFn } from '@tanstack/react-start';
import {
  createGame,
  getAllGames,
  getGameByName,
} from '#/api/routes/games/games.queries';
import * as zod from 'zod';

export const createSchema = zod.object({
  editionDetails: zod.string().describe('Edition details'),
  isSpecialEdition: zod.boolean().describe('Is special edition'),
  name: zod.string().describe('Name').min(1),
  system: zod.string().describe('System').min(1),
});

export const create = createServerFn({
  method: 'POST',
})
  .inputValidator(createSchema)
  .handler(async ({ data }) => {
    // TODO ADD AUTHENTICATED USER ID LOGIC
    return createGame(data);
  });

export const getAll = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllGames();
});

const getByNameSchema = zod.object({ name: zod.string() });

export const getByName = createServerFn({
  method: 'GET',
})
  .inputValidator(getByNameSchema)
  .handler(({ data }) => {
    return getGameByName(data.name);
  });
