import { and, eq, inArray, isNull } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import type { DeleteCollectionItemsByIdsSchemaDef } from './delete-collection-items-by-ids.type';

export const deleteCollectionItemsByIdsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<DeleteCollectionItemsByIdsSchemaDef>) => {
  const { collectionItemIds } = data;

  const userId = context.user.id;

  await db.transaction(async (tx) => {
    const data = await tx
      .delete(collectionItemsTable)
      .where(
        and(
          inArray(collectionItemsTable.id, collectionItemIds),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      )
      .returning({ images: collectionItemsTable.images });

    const publicIds = data.reduce<string[]>((acc, { images }) => {
      return [...acc, ...images];
    }, []);

    await deleteCloudinaryAssetsByPublicIds(...publicIds);
  });
};
