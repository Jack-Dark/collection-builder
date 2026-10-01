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

    const mappingRecords = newRecords.map(({ id }, index) => {
      return { collectionId: records[index].collectionId, customFieldId: id };
    });

    await tx
      .insert(collectionsToCustomFieldsTable)
      .values(mappingRecords)
      .onConflictDoNothing();

    return newRecords;
  });
};
