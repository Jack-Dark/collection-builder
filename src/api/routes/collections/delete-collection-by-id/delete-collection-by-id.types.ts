import type z from 'zod';

import type { deleteCollectionByIdSchema } from './delete-collection-by-id.schema';

export type DeleteCollectionByIdSchemaDef = z.output<
  typeof deleteCollectionByIdSchema
>;
