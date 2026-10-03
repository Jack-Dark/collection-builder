import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';

import type { DeleteCustomFieldsDbQueryArgsDef } from './delete-custom-fields.types';

export const deleteCustomFieldsDbQuery = async (
  props: DeleteCustomFieldsDbQueryArgsDef,
) => {
  const { ids, userId } = props;

  const matchesUserAndIds = and(
    eq(customFieldsTable.userId, userId),
    isNull(customFieldsTable.deletedAt),
    inArray(customFieldsTable.id, ids),
  );

  await db.delete(customFieldsTable).where(matchesUserAndIds);
};
