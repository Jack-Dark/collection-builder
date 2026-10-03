import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';
import { customFieldTypeLabelsMap } from '#/pages/CollectionsListPage/components/CollectionsListTable/components/column-cells/CollectionsListCustomFieldsCell';

import type { UpdateCustomFieldsDbQueryRecordDef } from './update-custom-fields.types';

export const updateCustomFieldsDbQuery = async (props: {
  records: UpdateCustomFieldsDbQueryRecordDef[];
}) => {
  const { records } = props;

  return db.transaction(async (tx) => {
    const matchingExistingCustomFields = await Promise.all(
      records.map(async ({ name, type, userId }) => {
        const matchingRecord = await tx.query.customFields.findFirst({
          where: {
            name,
            type,
            userId,
          },
        });

        return matchingRecord;
      }),
    );

    for (const customField of matchingExistingCustomFields) {
      if (customField) {
        throw new Error(
          `Custom field "${customField.name} (${customFieldTypeLabelsMap[customField.type]})" already exists.`,
        );
      }
    }

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
