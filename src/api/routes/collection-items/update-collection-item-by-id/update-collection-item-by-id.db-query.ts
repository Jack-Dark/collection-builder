import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';

import type { UpdateCollectionItemSchemaDef } from './update-collection-item-by-id.types';

export const updateCollectionItemDbQuery = async (
  props: UpdateCollectionItemSchemaDef,
) => {
  const { id, images, userId, ...rest } = props;

  return await db.transaction(async (tx) => {
    const whereSql = and(
      eq(collectionItemsTable.id, id),
      eq(collectionItemsTable.userId, userId),
      isNull(collectionItemsTable.deletedAt),
    );

    const hasFilesToUpload = images.some((img) => {
      return img instanceof File;
    });

    if (hasFilesToUpload) {
      const updatedImages = await Promise.all(
        images.map((img) => {
          if (img instanceof File) {
            // TODO HANDLE UPLOAD
            return 'MOCK_VALUE';
          } else {
            return img;
          }
        }),
      );

      const [recordWithImageUploads] = await tx
        .update(collectionItemsTable)
        .set({
          images: updatedImages,
          updatedAt: new Date().toDateString(),
        })
        .where(whereSql)
        .returning();

      return recordWithImageUploads;
    } else {
      const [recordWithoutImageUploads] = await tx
        .update(collectionItemsTable)
        .set({ ...rest, images: images as string[] })
        .where(whereSql)
        .returning();

      return recordWithoutImageUploads;
    }
  });
};
