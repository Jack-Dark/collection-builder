import { db } from '#/api/db';
import { addCloudinaryTagsToPublicIds } from '#/lib/cloudinary';

import type { CustomFieldValuesByFieldId } from '../../custom-field-values/custom-field-values.types';
import type { InsertCollectionItemRecordDef } from '../collection-item.types';
import type { CreateCollectionItemsDbQueryArgs } from './create-collection-item.types';

import { collectionItemsTable } from '../../../db-tables-schema';
import { createCloudinaryTags } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';

export const createCollectionItemsDbQuery = async (
  props: CreateCollectionItemsDbQueryArgs,
) => {
  const { publicIds, records, userId } = props;

  if (!records.length) {
    return;
  }

  const customFieldValuesIndexedToRecord: CustomFieldValuesByFieldId[] = [];

  const formattedCollectionItemRecords = records.map(
    ({ customFieldValues, ...record }) => {
      customFieldValuesIndexedToRecord.push(customFieldValues);

      return { ...record, userId } satisfies InsertCollectionItemRecordDef;
    },
  );

  await db.transaction(async (tx) => {
    // ? create new collection items
    const newCollectionItems = await tx
      .insert(collectionItemsTable)
      .values(formattedCollectionItemRecords)
      .onConflictDoNothing()
      .returning();

    // ? add tags to Cloudinary assets
    await Promise.all(
      newCollectionItems.map(async (record, index) => {
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
  });
};
