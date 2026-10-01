import { and, eq, isNull } from 'drizzle-orm';

import type { InsertCustomFieldRecordDef } from '#/api/db-tables-schema.types';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type { CreateCustomFieldsDbQueryRecordDef } from '../../custom-fields/create-custom-fields/create-custom-fields.types';
import type { OnUpdateCollectionsArgsDef } from './update-collection-by-id.types';

import { createCustomFieldsDbQuery } from '../../custom-fields/create-custom-fields/create-custom-fields.db-query';

export const updateCollectionByIdDbQuery = async ({
  records: recordsToUpdate,
}: OnUpdateCollectionsArgsDef) => {
  if (recordsToUpdate.length === 0) {
    return [];
  }

  const { userId } = recordsToUpdate[0];

  for (const { customFields, ...record } of recordsToUpdate) {
    const separatedCustomFields = customFields.reduce<{
      existing: InsertCustomFieldRecordDef[];
      new: CreateCustomFieldsDbQueryRecordDef[];
    }>(
      (acc, { id, ...data }) => {
        if (typeof id === 'string') {
          acc.new.push({ ...data, collectionId: record.id, userId });
        } else {
          acc.existing.push({ id, ...data, userId });
        }

        return acc;
      },
      {
        existing: [],
        new: [],
      },
    );

    if (separatedCustomFields.new.length) {
      await createCustomFieldsDbQuery({
        records: separatedCustomFields.new,
      });
    }
    if (separatedCustomFields.existing.length) {
      // await updateCustomFieldsDbQuery({
      //   records: separatedCustomFields.existing,
      // });
    }

    await db
      .update(collectionsTable)
      .set(record)
      .where(
        and(
          eq(collectionsTable.id, record.id),
          eq(collectionsTable.userId, record.userId),
          isNull(collectionsTable.deletedAt),
        ),
      );
  }
};
