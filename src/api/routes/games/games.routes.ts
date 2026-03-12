import { createServerFn } from '@tanstack/react-start';
import { createGame, getAllGames } from '#/api/routes/games/games.queries';
import { addGameFormSchema } from '#/pages/collection/components/AddGameForm/schema';

export const create = createServerFn({
  method: 'POST',
})
  .inputValidator(addGameFormSchema)
  .handler(async ({ data }) => {
    return createGame(data);
  });

export const getAll = createServerFn({
  method: 'GET',
}).handler(() => {
  return getAllGames();
});
