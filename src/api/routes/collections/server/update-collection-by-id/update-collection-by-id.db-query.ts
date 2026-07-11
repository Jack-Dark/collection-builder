import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type { UpdateCollectionRecordDef } from '../types';

export const updateCollectionDbQuery = async (
  data: UpdateCollectionRecordDef,
) => {
  const { userId } = data;
  // TODO - MAY HAVE TO MERGE OLD AND NEW DATA. GET COLLECTION BY ID, IF NEEDED
  const [record] = await db
    .update(collectionsTable)
    .set({ ...data, updatedAt: new Date().toDateString() })
    .where(
      and(
        eq(collectionsTable.id, data.id),
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    )
    .returning();

  return record;
};
