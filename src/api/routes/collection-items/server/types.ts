import type { TimestampsDef } from '#/api/types';

import type { collectionItemsTable } from '../../../schema';

export type CollectionItemRecordDef = typeof collectionItemsTable.$inferSelect;

export type NewCollectionItemRecordDef =
  typeof collectionItemsTable.$inferInsert;

export type UpdateCollectionItemRecordDef = Partial<
  Omit<CollectionItemRecordDef, keyof TimestampsDef>
> &
  Pick<CollectionItemRecordDef, 'id' | 'userId'>;
