import type { apiRoutes } from '#/api/routes';
import type * as zod from 'zod';

export const defaultValues: AddGameFormSchemaDef = {
  editionDetails: '',
  isSpecialEdition: false,
  name: '',
  system: '',
};

type AddGameFormSchemaDef = zod.Infer<typeof apiRoutes.games.createSchema>;
