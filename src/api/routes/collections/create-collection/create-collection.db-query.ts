import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { CreateCollectionDbQueryArgsDef } from './create-collection.types';

export const createCollectionDbQuery = async (
  records: CreateCollectionDbQueryArgsDef,
) => {
  if (!records || records.length === 0) {
    return [];
  }

  await db.transaction(async (tx) => {
    for (const { customFields, ...record } of records) {
      // ? Create new collection records
      const [newCollectionRecord] = await tx
        .insert(collectionsTable)
        .values(record)
        .onConflictDoNothing()
        .returning();

      // ? Create brand new links between this collection and custom fields
      const newCollectionToCustomFieldRecords = customFields.reduce<
        InsertLinkCollectionsToCustomFieldsRecordDef[]
      >((acc, customField) => {
        return [
          ...acc,
          {
            collectionId: newCollectionRecord.id,
            customFieldId: customField.id,
            order: customField.details.order,
            userId: records[0].userId,
          },
        ];
      }, []);

      if (newCollectionToCustomFieldRecords.length) {
        await tx
          .insert(collectionsToCustomFieldsTable)
          .values(newCollectionToCustomFieldRecords);
      }
    }
  });
};
