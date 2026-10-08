import { and, eq, isNull } from 'drizzle-orm';

import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { OnUpdateCollectionsArgsDef } from './update-collection-by-id.types';

export const updateCollectionByIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<OnUpdateCollectionsArgsDef>) => {
  const { records: recordsToUpdate } = data;

  const userId = context.user.id;

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
              eq(collectionsTable.userId, userId),
              isNull(collectionsTable.deletedAt),
            ),
          ),

        // ? Delete any existing links between this collection and custom fields
        tx
          .delete(collectionsToCustomFieldsTable)
          .where(eq(collectionsToCustomFieldsTable.collectionId, record.id)),
      ]);

      console.clear();

      // ? Create brand new links between this collection and custom fields
      const newCollectionToCustomFieldRecords: InsertLinkCollectionsToCustomFieldsRecordDef[] =
        customFields.map(({ customField, order }) => {
          return {
            collectionId: record.id,
            customFieldId: customField.id,
            order,
            userId,
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
