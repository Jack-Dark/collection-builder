import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type {
  CollectionRecordDef,
  InsertCollectionRecordDef,
} from '../collection.types';

export const createCollectionDbQuery = async (
  data: InsertCollectionRecordDef,
): Promise<CollectionRecordDef> => {
  const [newCollection] = await db
    .insert(collectionsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return newCollection;
};
