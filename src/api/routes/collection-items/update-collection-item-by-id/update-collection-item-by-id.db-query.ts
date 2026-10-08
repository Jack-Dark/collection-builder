import { and, eq, inArray, isNull, sql } from 'drizzle-orm';

import type { InsertLinkCollectionItemsToCustomFieldValuesRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';
import {
  addCloudinaryTagsToPublicIds,
  deleteCloudinaryAssetsByPublicIds,
} from '#/lib/cloudinary';

import type { CustomFieldValueDef } from '../../custom-field-values/custom-field-values.types';
import type { UpdateCollectionItemsRequestArgsDef } from './update-collection-item-by-id.types';

import { createCloudinaryTags } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';

export const updateCollectionItemsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<UpdateCollectionItemsRequestArgsDef>) => {
  const { records: collectionItemRecords, uploadedPublicIds } = data;
  if (collectionItemRecords.length === 0) {
    return;
  }

  const userId = context.user.id;

  const collectionItemIds = collectionItemRecords.map(({ id }) => {
    return id;
  });

  await db.transaction(async (tx) => {
    // ? Get all old images to track which ones the user deleted
    const existingImagesRecords = await tx
      .select({ images: collectionItemsTable.images })
      .from(collectionItemsTable)
      .where(
        and(
          inArray(collectionItemsTable.id, collectionItemIds),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
          sql`json_array_length(${collectionItemsTable.images}) > 0`,
        ),
      );

    // ? Save list of user deleted public IDs for removal
    const userDeletedPublicIds = existingImagesRecords.reduce<string[]>(
      (acc, { images: existingImages }, index) => {
        const deletedPublicIds = existingImages.filter((existingPublicId) => {
          const imageWasKept = uploadedPublicIds[index].some(
            (uploadedPublicId) => {
              return existingPublicId === uploadedPublicId;
            },
          );

          return !imageWasKept;
        });

        return [...acc, ...deletedPublicIds];
      },
      [],
    );

    await Promise.all(
      collectionItemRecords.map(
        async ({ customFieldValues, ...record }, index) => {
          const addCloudinaryTags = async () => {
            const { collectionId, id: collectionItemId } = record;
            const tags = createCloudinaryTags({
              collectionId,
              collectionItemId,
              userId,
            });

            const publicIdsForRecord = uploadedPublicIds[index];

            await addCloudinaryTagsToPublicIds({
              publicIds: publicIdsForRecord,
              tags,
            });
          };

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

          let customFieldValueIds: { id: number }[] = [];

          if (customFieldValueRecords.toCreate.length) {
            // ? create new custom field value records
            // TODO -  I'M NOT SURE IF THIS STILL RUNS AT ALL. VERIFY AND REMOVE IF APPLICABLE
            const newRecordIds = await tx
              .insert(customFieldValuesTable)
              .values(customFieldValueRecords.toCreate)
              .returning({ id: customFieldValuesTable.id });

            customFieldValueIds = [...newRecordIds];
          }

          if (customFieldValueRecords.toUpdate.length) {
            // ? update existing custom field value records
            const updatedRecordIds = await Promise.all(
              customFieldValueRecords.toUpdate.map(async (customFieldValue) => {
                const [updatedRecord] = await tx
                  .update(customFieldValuesTable)
                  .set(customFieldValue)
                  .where(
                    and(
                      eq(customFieldValuesTable.id, customFieldValue.id),
                      eq(
                        customFieldValuesTable.userId,
                        customFieldValue.userId,
                      ),
                    ),
                  )
                  .returning({ id: customFieldValuesTable.id });

                return updatedRecord;
              }),
            );

            customFieldValueIds = [...customFieldValueIds, ...updatedRecordIds];
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
            // ? add tags to the images on the collection item
            await addCloudinaryTags(),
          ]);

          // ? Create brand new links between this collection and custom fields
          const newCollectionItemToCustomFieldValueRecords: InsertLinkCollectionItemsToCustomFieldValuesRecordDef[] =
            customFieldValueIds.map(({ id }) => {
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
        },
      ),
    );

    // ? Remove user deleted images, if any
    await deleteCloudinaryAssetsByPublicIds(...userDeletedPublicIds.flat());
  });
};
