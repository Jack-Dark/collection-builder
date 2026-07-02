import type z from 'zod';

import type { collectionItemFormSchema } from '#/api/routes/collection-items/server/serverFns';

export type AddCollectionItemFormSchemaDef = z.Infer<
  typeof collectionItemFormSchema
>;
