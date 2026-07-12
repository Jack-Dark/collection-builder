import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { InsertCollectionItemRecordDef } from './create-collection-item.types';

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
