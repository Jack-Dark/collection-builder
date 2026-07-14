import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

export const deleteCollectionDbQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionsTable)
    .where(
      and(
        eq(collectionsTable.id, id),
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    );
};
