import { and, eq, isNull } from 'drizzle-orm';

import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { OnUpdateCollectionsArgsDef } from './update-collection-by-id.types';

export const updateCollectionByIdDbQuery = async ({
  records: recordsToUpdate,
}: OnUpdateCollectionsArgsDef) => {
  if (recordsToUpdate.length === 0) {
    return [];
  }

  for (const { customFields, ...record } of recordsToUpdate) {
    await db.transaction(async (tx) => {
      await Promise.all([
        // ? Updates collection record
        tx
          .update(collectionsTable)
          .set(record)
          .where(
            and(
              eq(collectionsTable.id, record.id),
              eq(collectionsTable.userId, record.userId),
              isNull(collectionsTable.deletedAt),
            ),
          ),

        // ? Delete any existing links between this collection and custom fields
        tx
          .delete(collectionsToCustomFieldsTable)
          .where(eq(collectionsToCustomFieldsTable.collectionId, record.id)),
      ]);

      // ? Create brand new links between this collection and custom fields
      const newCollectionToCustomFieldRecords: InsertLinkCollectionsToCustomFieldsRecordDef[] =
        customFields.map(({ id }) => {
          return {
            collectionId: record.id,
            customFieldId: id,
            userId: record.userId,
          };
        });

      if (newCollectionToCustomFieldRecords.length) {
        await tx
          .insert(collectionsToCustomFieldsTable)
          .values(newCollectionToCustomFieldRecords);
      }
    });
  }
};
