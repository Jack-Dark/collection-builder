import type { createCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';
import type z from 'zod';

export type AddCollectionItemFormSchemaDef = z.Infer<
  typeof createCollectionItemSchema
>;
