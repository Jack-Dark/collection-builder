import type { TimestampsDef } from '#/api/types';

import type { collectionsTable } from '../../../schema';

export type CollectionRecordDef = typeof collectionsTable.$inferSelect;

export type NewCollectionRecordDef = typeof collectionsTable.$inferInsert;

export type UpdateCollectionRecordDef = Partial<
  Omit<CollectionRecordDef, 'id' | 'userId' | keyof TimestampsDef>
> &
  Pick<CollectionRecordDef, 'id' | 'userId'>;
