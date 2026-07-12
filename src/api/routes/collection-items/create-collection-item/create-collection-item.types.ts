import type { InferInsertModel } from 'drizzle-orm';
import type z from 'zod';

import type { collectionItemsTable } from '#/api/db-tables-schema';

import type { createCollectionItemSchema } from './create-collection-item.schema';

export type InsertCollectionItemRecordDef = Omit<
  InferInsertModel<typeof collectionItemsTable>,
  'images'
> &
  Pick<CreateCollectionItemSchemaDef, 'images'>;

export type CreateCollectionItemSchemaDef = z.output<
  typeof createCollectionItemSchema
>;
