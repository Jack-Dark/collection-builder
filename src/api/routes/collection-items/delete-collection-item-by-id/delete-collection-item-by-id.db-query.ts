import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

export const deleteCollectionItemByIdDbQuery = async (props: {
  ids: number[];
  userId: string;
}) => {
  const { ids, userId } = props;

  await db.transaction(async (tx) => {
    const images = await tx
      .delete(collectionItemsTable)
      .where(
        and(
          inArray(collectionItemsTable.id, ids),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      )
      .returning({ images: collectionItemsTable.images });

    const publicIds = images.reduce<string[]>((acc, { images }) => {
      return [...acc, ...images];
    }, []);

    await deleteCloudinaryAssetsByPublicIds(...publicIds);
  });
};
