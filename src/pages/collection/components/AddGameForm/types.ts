import type { apiRoutes } from '#/api/routes';
import type * as zod from 'zod';

export type AddGameFormSchemaDef = zod.Infer<
  typeof apiRoutes.games.createSchema
>;
