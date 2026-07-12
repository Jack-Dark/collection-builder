import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';

import type {
  CollectionItemRecordDef,
  InsertCollectionItemRecordDef,
  UpdateCollectionItemSchemaDef,
} from '../collection-item.types';

import { collectionItemsTable } from '../../../db-tables-schema';

export const createCollectionItemDbQuery = async ({
  images,
  ...rest
}: InsertCollectionItemRecordDef): Promise<CollectionItemRecordDef> => {
  const record = await db.transaction(async (tx) => {
    const [recordWithoutImageUploads] = await tx
      .insert(collectionItemsTable)
      .values(rest)
      .onConflictDoNothing()
      .returning();

    const { id: collectionItemId, userId } = recordWithoutImageUploads;

    if (images?.length) {
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
        })
        .where(
          and(
            eq(collectionItemsTable.id, collectionItemId),
            eq(collectionItemsTable.userId, userId),
            isNull(collectionItemsTable.deletedAt),
          ),
        )
        .returning();

      return recordWithImageUploads;
    }

    return recordWithoutImageUploads;
  });

  return record;
};

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

export const deleteCollectionItemByIdDbQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionItemsTable)
    .where(
      and(
        eq(collectionItemsTable.id, id),
        eq(collectionItemsTable.userId, userId),
        isNull(collectionItemsTable.deletedAt),
      ),
    );
};
