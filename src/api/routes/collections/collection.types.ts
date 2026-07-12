import type { collectionsTable } from '../../db-tables-schema';

export type CollectionRecordDef = typeof collectionsTable.$inferSelect;

export type NewCollectionRecordDef = typeof collectionsTable.$inferInsert;
