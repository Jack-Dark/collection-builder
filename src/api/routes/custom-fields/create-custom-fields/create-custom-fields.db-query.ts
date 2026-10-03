import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';
import { customFieldTypeLabelsMap } from '#/pages/CollectionsListPage/components/CollectionsListTable/components/column-cells/CollectionsListCustomFieldsCell';

import type { CreateCustomFieldsDbQueryRecordDef } from './create-custom-fields.types';

export const createCustomFieldsDbQuery = async (props: {
  records: CreateCustomFieldsDbQueryRecordDef[];
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

    const newRecords = await tx
      .insert(customFieldsTable)
      .values(records)
      .onConflictDoNothing()
      .returning();

    return newRecords;
  });
};
