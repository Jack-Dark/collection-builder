import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';

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

    return newRecords;
  });
};
