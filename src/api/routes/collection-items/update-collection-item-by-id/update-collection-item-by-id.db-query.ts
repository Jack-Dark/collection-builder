import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { UpdateCollectionItemsRequestArgsDef } from './update-collection-item-by-id.types';

export const updateCollectionItemsDbQuery = async (
  props: UpdateCollectionItemsRequestArgsDef,
) => {
  const { allUploadedPublicIds, records: recordsToUpdate } = props;
  if (recordsToUpdate.length === 0) {
    return [];
  }

  const updatedCollectionItemIds = recordsToUpdate.map(({ id }) => {
    return id;
  });
  const [{ userId }] = recordsToUpdate;

  return await db.transaction(async (tx) => {
    // ? Save list of user deleted public IDs for removal
    const oldImagesRecords = await tx
      .select({ images: collectionItemsTable.images })
      .from(collectionItemsTable)
      .where(
        and(
          inArray(collectionItemsTable.id, updatedCollectionItemIds),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      );

    const userDeletedPublicIds = oldImagesRecords.reduce<string[]>(
      (acc, record, index) => {
        const { images: oldPublicIds } = record;
        const deletedPublicIds = oldPublicIds.filter((oldPublicId) => {
          const imageWasKept = allUploadedPublicIds[index].some(
            (uploadedPublicId) => {
              return oldPublicId === uploadedPublicId;
            },
          );

          return !imageWasKept;
        });

        return [...acc, ...deletedPublicIds];
      },
      [],
    );

    // ? Updated records
    const updatedRecords: CollectionItemRecordDef[] = [];

    for (const record of recordsToUpdate) {
      const [updatedRecord] = await tx
        .update(collectionItemsTable)
        .set(record)
        .where(
          and(
            eq(collectionItemsTable.id, record.id),
            eq(collectionItemsTable.userId, userId),
            isNull(collectionItemsTable.deletedAt),
          ),
        )
        .returning();

      updatedRecords.push(updatedRecord);
    }

    // ? Remove user deleted images, if any
    await deleteCloudinaryAssetsByPublicIds(...userDeletedPublicIds.flat());

    return updatedRecords;
  });
};
