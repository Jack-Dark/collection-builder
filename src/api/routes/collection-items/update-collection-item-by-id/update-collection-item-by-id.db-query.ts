import { and, eq, inArray, isNull } from 'drizzle-orm';

import type {
  CustomFieldValueRecordDef,
  InsertLinkCollectionItemsToCustomFieldValuesRecordDef,
} from '#/api/db-tables-schema.types';

import { db } from '#/api/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import type { CustomFieldValueDef } from '../../custom-field-values/custom-field-values.types';
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
    // ? Get all old images to track which ones the user deleted
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

    // ? Save list of user deleted public IDs for removal
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

    await Promise.all(
      recordsToUpdate.map(async ({ customFieldValues, ...record }) => {
        // ? Create brand new links between this collection and custom fields
        const customFieldValueRecords = Object.entries(
          customFieldValues,
        ).reduce<{
          toCreate: {
            customFieldId: number;
            data: { value: CustomFieldValueDef };
            userId: string;
          }[];
          toUpdate: {
            customFieldId: number;
            data: { value: CustomFieldValueDef };
            id: number;
            userId: string;
          }[];
        }>(
          (acc, [customFieldIdAsString, customFieldValue]) => {
            const customFieldId = Number(customFieldIdAsString);

            if (!customFieldValue) {
              return acc;
            } else if (typeof customFieldValue.id === 'string') {
              return {
                ...acc,
                toCreate: [
                  ...acc.toCreate,
                  {
                    customFieldId,
                    data: customFieldValue.data,
                    userId,
                  },
                ],
              };
            } else {
              return {
                ...acc,
                toUpdate: [
                  ...acc.toUpdate,
                  {
                    customFieldId,
                    data: customFieldValue.data,
                    id: customFieldValue.id,
                    userId,
                  },
                ],
              };
            }
          },
          {
            toCreate: [],
            toUpdate: [],
          },
        );

        let newestCustomFieldValueRecords: CustomFieldValueRecordDef[] = [];

        if (customFieldValueRecords.toCreate.length) {
          const newRecords = await tx
            .insert(customFieldValuesTable)
            .values(customFieldValueRecords.toCreate)
            .returning();

          newestCustomFieldValueRecords = [
            ...newestCustomFieldValueRecords,
            ...newRecords,
          ];
        }

        if (customFieldValueRecords.toUpdate.length) {
          const updatedRecords = await Promise.all(
            customFieldValueRecords.toUpdate.map(async (customFieldValue) => {
              const [updatedRecord] = await tx
                .update(customFieldValuesTable)
                .set(customFieldValue)
                .where(
                  and(
                    eq(customFieldValuesTable.id, customFieldValue.id),
                    eq(customFieldValuesTable.userId, customFieldValue.userId),
                  ),
                )
                .returning();

              return updatedRecord;
            }),
          );

          newestCustomFieldValueRecords = [
            ...newestCustomFieldValueRecords,
            ...updatedRecords,
          ];
        }

        await Promise.all([
          // ? Update collection item records
          await tx
            .update(collectionItemsTable)
            .set(record)
            .where(
              and(
                eq(collectionItemsTable.id, record.id),
                eq(collectionItemsTable.userId, userId),
                isNull(collectionItemsTable.deletedAt),
              ),
            ),

          // ? Delete any existing links between this collection item and custom field values
          await tx
            .delete(collectionItemsToCustomFieldValuesTable)
            .where(
              eq(
                collectionItemsToCustomFieldValuesTable.collectionItemId,
                record.id,
              ),
            ),
        ]);

        // ? Create brand new links between this collection and custom fields
        const newCollectionItemToCustomFieldValueRecords: InsertLinkCollectionItemsToCustomFieldValuesRecordDef[] =
          newestCustomFieldValueRecords.map(({ id, userId }) => {
            return {
              collectionItemId: record.id,
              customFieldValueId: id,
              userId,
            } satisfies InsertLinkCollectionItemsToCustomFieldValuesRecordDef;
          });

        if (newCollectionItemToCustomFieldValueRecords.length) {
          await tx
            .insert(collectionItemsToCustomFieldValuesTable)
            .values(newCollectionItemToCustomFieldValueRecords);
        }
      }),
    );

    // ? Remove user deleted images, if any
    await deleteCloudinaryAssetsByPublicIds(...userDeletedPublicIds.flat());
  });
};
