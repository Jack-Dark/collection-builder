import { db } from '#/api/db';

import type {
  CollectionItemRecordDef,
  InsertCollectionItemRecordDef,
} from '../collection-item.types';

import { collectionItemsTable } from '../../../db-tables-schema';

export const createCollectionItemDbQuery = async (
  data: InsertCollectionItemRecordDef,
): Promise<CollectionItemRecordDef> => {
  const [record] = await db
    .insert(collectionItemsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return record;
};
