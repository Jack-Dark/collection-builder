import { and, eq, inArray, isNull } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type { DeleteCollectionByIdRequestArgsDef } from './delete-collection-by-id.types';

export const deleteCollectionDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<DeleteCollectionByIdRequestArgsDef>) => {
  const { ids } = data;

  const userId = context.user.id;

  await db.transaction(async (tx) => {
    // TODO - ADD LOGIC TO GET ALL IMAGES ON ITEMS IN COLLECTION

    // ? Delete collections
    await tx
      .delete(collectionsTable)
      .where(
        and(
          inArray(collectionsTable.id, ids),
          eq(collectionsTable.userId, userId),
          isNull(collectionsTable.deletedAt),
        ),
      );

    // TODO - DELETE IMAGES
  });
};
