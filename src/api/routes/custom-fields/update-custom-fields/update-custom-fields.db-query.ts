import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';

import type { UpdateCustomFieldsDbQueryRecordDef } from './update-custom-fields.types';

export const updateCustomFieldsDbQuery = async (props: {
  records: UpdateCustomFieldsDbQueryRecordDef[];
}) => {
  const { records } = props;

  return db.transaction(async (tx) => {
    const updatedRecords = await Promise.all(
      records.map(async (record) => {
        const [updatedRecord] = await tx
          .update(customFieldsTable)
          .set(record)
          .where(
            and(
              eq(customFieldsTable.id, record.id),
              eq(customFieldsTable.userId, record.userId),
              isNull(customFieldsTable.deletedAt),
            ),
          )
          .returning();

        return updatedRecord;
      }),
    );

    return updatedRecords;
  });
};
