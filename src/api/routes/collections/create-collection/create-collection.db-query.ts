import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type {
  CollectionRecordDef,
  InsertCollectionRecordDef,
} from '../collection.types';

export const createCollectionDbQuery = async (props: {
  records: InsertCollectionRecordDef[];
}): Promise<CollectionRecordDef[]> => {
  const { records } = props;

  const newRecords = await db
    .insert(collectionsTable)
    .values(records)
    .onConflictDoNothing()
    .returning();

  return newRecords;
};
