import type z from 'zod';

import type { createCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';

export type AddCollectionItemFormSchemaDef = z.Infer<
  typeof createCollectionItemSchema
>;
