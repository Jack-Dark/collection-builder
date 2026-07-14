import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
import { deleteCloudinaryAssetsByTag } from '#/lib/cloudinary';

import { createCollectionItemCloudinaryTag } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';

export const deleteCollectionItemByIdDbQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  return db.transaction(async (tx) => {
    await tx
      .delete(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.id, id),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      );

    const tag = createCollectionItemCloudinaryTag(id);

    await deleteCloudinaryAssetsByTag(tag);
  });
};
