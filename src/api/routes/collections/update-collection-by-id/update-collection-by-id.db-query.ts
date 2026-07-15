import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type { UpdateCollectionFormSchemaDef } from './update-collection-by-id.types';

export const updateCollectionByIdDbQuery = async (
  data: UpdateCollectionFormSchemaDef,
) => {
  const { userId } = data;

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
