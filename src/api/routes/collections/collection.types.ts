import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { collectionsTable } from '../../db-tables-schema';

export type CollectionRecordDef = InferSelectModel<typeof collectionsTable>;

export type InsertCollectionRecordDef = InferInsertModel<
  typeof collectionsTable
>;

export type CollectionTableColumnsDef = keyof CollectionRecordDef;
