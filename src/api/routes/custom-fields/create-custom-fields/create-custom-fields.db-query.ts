import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';

import { db } from '#/api/db';
import {
  collectionsToCustomFieldsTable,
  customFieldsTable,
} from '#/api/db-tables-schema';

import type { CreateCustomFieldsDbQueryRecordDef } from './create-custom-fields.types';

export const createCustomFieldsDbQuery = async (props: {
  records: CreateCustomFieldsDbQueryRecordDef[];
}) => {
  const { records } = props;

  return db.transaction(async (tx) => {
    const newRecords = await tx
      .insert(customFieldsTable)
      .values(records)
      .onConflictDoNothing()
      .returning();

    await Promise.all(
      newRecords.map(async ({ id }, index) => {
        const collectionId = records[index].collectionId;
        if (collectionId) {
          const collectionsToCustomFieldsRecord: InsertLinkCollectionsToCustomFieldsRecordDef =
            {
              collectionId,
              customFieldId: id,
            };

          await tx
            .insert(collectionsToCustomFieldsTable)
            .values(collectionsToCustomFieldsRecord)
            .onConflictDoNothing();
        }
      }),
    );

    return newRecords;
  });
};
