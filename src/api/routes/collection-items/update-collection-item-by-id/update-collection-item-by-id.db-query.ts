import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import type { UpdateCollectionItemByIdRequestArgsDef } from './update-collection-item-by-id.types';

export const updateCollectionItemDbQuery = async (
  updatedRecord: UpdateCollectionItemByIdRequestArgsDef,
) => {
  const { id: collectionItemId, userId } = updatedRecord;

  return await db.transaction(async (tx) => {
    const [{ images: oldImages }] = await tx
      .select({ images: collectionItemsTable.images })
      .from(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.id, collectionItemId),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      );

    const imagesToDelete = oldImages.filter((oldPublicId) => {
      const imageWasKept = updatedRecord.images.some((updatedPublicId) => {
        return oldPublicId === updatedPublicId;
      });

      return !imageWasKept;
    });

    if (imagesToDelete.length) {
      await deleteCloudinaryAssetsByPublicIds(...imagesToDelete);
    }

    const [record] = await tx
      .update(collectionItemsTable)
      .set(updatedRecord)
      .where(
        and(
          eq(collectionItemsTable.id, collectionItemId),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      )
      .returning();

    return record;
  });
};
