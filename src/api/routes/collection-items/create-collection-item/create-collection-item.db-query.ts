import { db } from '#/api/db';
import { addCloudinaryTagsToPublicIds } from '#/lib/cloudinary';

import type {
  CollectionItemRecordDef,
  InsertCollectionItemRecordDef,
} from '../collection-item.types';

import { collectionItemsTable } from '../../../db-tables-schema';
import { createCloudinaryTags } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';

export const createCollectionItemsDbQuery = async (props: {
  publicIds: string[][];
  records: InsertCollectionItemRecordDef[];
}): Promise<CollectionItemRecordDef[]> => {
  const { publicIds, records } = props;

  const newRecords = await db
    .insert(collectionItemsTable)
    .values(records)
    .onConflictDoNothing()
    .returning();

  // ? add tags to Cloudinary assets
  await Promise.all(
    newRecords.map(async (record, index) => {
      const { collectionId, id: collectionItemId, userId } = record;

      const tags = createCloudinaryTags({
        collectionId,
        collectionItemId,
        userId,
      });

      const publicIdsForRecord = publicIds[index];

      await addCloudinaryTagsToPublicIds({
        publicIds: publicIdsForRecord,
        tags,
      });
    }),
  );

  return newRecords;
};
