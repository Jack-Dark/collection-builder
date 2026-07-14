import type { InferInsertModel } from 'drizzle-orm';
import type z from 'zod';

import type { collectionItemsTable } from '#/api/db-tables-schema';

import type {
  createCollectionItemFormSchema,
  createCollectionItemServerFnSchema,
} from './create-collection-item.schema';

export type InsertCollectionItemRecordDef = Omit<
  InferInsertModel<typeof collectionItemsTable>,
  'images'
> &
  Pick<CreateCollectionItemFormSchemaDef, 'images'>;

export type CreateCollectionItemFormSchemaDef = z.output<
  typeof createCollectionItemFormSchema
>;

export type CreateCollectionItemRequestArgsDef = z.output<
  typeof createCollectionItemServerFnSchema
>;
