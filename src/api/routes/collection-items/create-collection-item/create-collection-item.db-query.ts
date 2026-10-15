import type { InsertLinkCollectionItemsToCustomFieldValuesRecordDef } from '#/api/db-tables-schema.types';
import type { CloudinaryTagsItem } from '#/lib/cloudinary';

import { db } from '#/api/db';
import { addCloudinaryTagsToPublicIds } from '#/lib/cloudinary';

import type { CustomFieldValuesByFieldId } from '../../custom-field-values/custom-field-values.types';
import type { InsertCollectionItemRecordDef } from '../collection-item.types';
import type { CreateCollectionItemsDbQueryArgsDef } from './create-collection-item.types';

import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
} from '../../../db-tables-schema';

export const createCollectionItemsDbQuery = async ({
  context,
  data,
}: CreateCollectionItemsDbQueryArgsDef) => {
  const { publicIds, records } = data;

  if (!records.length) {
    return;
  }

  const userId = context.user.id;

  const customFieldValuesIndexedToRecord: CustomFieldValuesByFieldId[] = [];

  const formattedCollectionItemRecords = records.map(
    ({ customFieldValues, ...record }) => {
      customFieldValuesIndexedToRecord.push(customFieldValues);

      return { ...record, userId } satisfies InsertCollectionItemRecordDef;
    },
  );

  await db.transaction(async (tx) => {
    // ? create new collection items
    const newCollectionItemRecords = await tx
      .insert(collectionItemsTable)
      .values(formattedCollectionItemRecords)
      .onConflictDoNothing()
      .returning();

    // ? Create links between the collection items and custom field values
    const collectionItemsToCustomFieldValues =
      customFieldValuesIndexedToRecord.reduce<
        InsertLinkCollectionItemsToCustomFieldValuesRecordDef[]
      >((acc, customFieldValues, index) => {
        const collectionItem = newCollectionItemRecords[index];

        const customFieldValuesForCollectionItem = Object.values(
          customFieldValues,
        ).reduce<InsertLinkCollectionItemsToCustomFieldValuesRecordDef[]>(
          (acc, customFieldValue) => {
            if (customFieldValue) {
              return [
                ...acc,
                {
                  collectionItemId: collectionItem.id,
                  customFieldValueId: customFieldValue.id,
                  userId,
                } satisfies InsertLinkCollectionItemsToCustomFieldValuesRecordDef,
              ];
            } else {
              return acc;
            }
          },
          [],
        );

        return [...acc, ...customFieldValuesForCollectionItem];
      }, []);

    if (collectionItemsToCustomFieldValues.length) {
      await tx
        .insert(collectionItemsToCustomFieldValuesTable)
        .values(collectionItemsToCustomFieldValues);
    }

    const cloudinaryTagItems = newCollectionItemRecords.map(
      ({ collectionId, id: collectionItemId, userId }, index) => {
        const publicIdsForRecord = publicIds[index];

        return {
          collectionId,
          collectionItemId,
          publicIds: publicIdsForRecord,
          userId,
        } satisfies CloudinaryTagsItem;
      },
    );

    await addCloudinaryTagsToPublicIds(...cloudinaryTagItems);
  });
};
