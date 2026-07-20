import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type { CollectionRecordDef } from '../collection.types';
import type { OnUpdateCollectionsArgsDef } from './update-collection-by-id.types';

export const updateCollectionByIdDbQuery = async ({
  records: recordsToUpdate,
}: OnUpdateCollectionsArgsDef) => {
  if (recordsToUpdate.length === 0) {
    return [];
  }

  const updatedCollectionsIds = recordsToUpdate.map(({ id }) => {
    return id;
  });
  const [{ userId }] = recordsToUpdate;

  const updatedRecords: CollectionRecordDef[] = [];

  for (const record of recordsToUpdate) {
    const [updatedRecord] = await db
      .update(collectionsTable)
      .set(record)
      .where(
        and(
          inArray(collectionsTable.id, updatedCollectionsIds),
          eq(collectionsTable.userId, userId),
          isNull(collectionsTable.deletedAt),
        ),
      )
      .returning();

    updatedRecords.push(updatedRecord);
  }

  return updatedRecords;
};
