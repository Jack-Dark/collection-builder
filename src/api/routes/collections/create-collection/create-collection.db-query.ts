import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { CollectionRecordDef } from '../collection.types';
import type { CreateCollectionDbQueryArgsDef } from './create-collection.types';

export const createCollectionDbQuery = async (
  records: CreateCollectionDbQueryArgsDef,
): Promise<CollectionRecordDef[]> => {
  if (!records || records.length === 0) {
    return [];
  }

  const response = await db.transaction(async (tx) => {
    // ? Create new category records
    const newRecords = await tx
      .insert(collectionsTable)
      .values(records)
      .onConflictDoNothing()
      .returning();

    // ? Create brand new links between this collection and custom fields
    const newCollectionToCustomFieldRecords: InsertLinkCollectionsToCustomFieldsRecordDef[] =
      [];
    newRecords.forEach(({ id: collectionId }, index) => {
      const customFieldIds = records[index].customFields.map(({ id }) => {
        return id;
      });

      customFieldIds.forEach((customFieldId) => {
        newCollectionToCustomFieldRecords.push({ collectionId, customFieldId });
      });
    });

    // TODO - COMMENT OUT IF STATEMENT TO TEST ERROR HANDLING
    // if (newCollectionToCustomFieldRecords.length) {
    await tx
      .insert(collectionsToCustomFieldsTable)
      .values(newCollectionToCustomFieldRecords);
    // }

    return newRecords;
  });

  return response;
};
