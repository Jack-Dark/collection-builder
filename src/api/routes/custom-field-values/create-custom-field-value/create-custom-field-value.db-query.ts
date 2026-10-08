import { and, eq } from 'drizzle-orm';

import type { InsertCustomFieldValueRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  customFieldValuesTable,
  equalsCustomFieldValue,
} from '#/api/db-tables-schema';

import type { CreateCustomFieldValuesRequestArgsDef } from './create-custom-field-value.types';

export const createCustomFieldValuesDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<CreateCustomFieldValuesRequestArgsDef>) => {
  const { records } = data;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const formattedCustomFieldValues = records.map(({ value, ...rest }) => {
      return {
        ...rest,
        data: { value },
        userId,
      } satisfies InsertCustomFieldValueRecordDef;
    });

    const newRecords = await Promise.all(
      formattedCustomFieldValues.map(async (record) => {
        const [matchingRecord] = await tx
          .select({
            data: customFieldValuesTable.data,
            id: customFieldValuesTable.id,
          })
          .from(customFieldValuesTable)
          .where(
            and(
              eq(customFieldValuesTable.customFieldId, record.customFieldId),
              equalsCustomFieldValue(record.data.value),
              eq(customFieldValuesTable.userId, record.userId),
            ),
          );

        if (matchingRecord) {
          return matchingRecord;
        } else {
          const [newRecord] = await tx
            .insert(customFieldValuesTable)
            .values(formattedCustomFieldValues)
            .onConflictDoNothing()
            .returning({
              data: customFieldValuesTable.data,
              id: customFieldValuesTable.id,
            });

          return newRecord;
        }
      }),
    );

    return newRecords;
  });
};
