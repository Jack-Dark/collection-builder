import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

export const deleteCollectionDbQuery = async (props: {
  ids: number[];
  userId: string;
}) => {
  const { ids, userId } = props;

  await db
    .delete(collectionsTable)
    .where(
      and(
        inArray(collectionsTable.id, ids),
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    );
};
