import type { InferSelectModel } from 'drizzle-orm';

import type { collectionItemsTable } from '../../db-tables-schema';

export type CollectionItemRecordDef = InferSelectModel<
  typeof collectionItemsTable
>;

export type CollectionItemsTableColumn = keyof CollectionItemRecordDef;
