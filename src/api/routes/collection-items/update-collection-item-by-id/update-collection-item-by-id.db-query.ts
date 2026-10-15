import { and, eq, inArray, sql } from 'drizzle-orm';

import type { InsertLinkCollectionItemsToCustomFieldValuesRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';
import type { CloudinaryTagsItem } from '#/lib/cloudinary';

import { db } from '#/api/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
} from '#/api/db-tables-schema';
import {
  addCloudinaryTagsToPublicIds,
  deleteCloudinaryAssetsByPublicIds,
} from '#/lib/cloudinary';

import type { UpdateCollectionItemsRequestArgsDef } from './update-collection-item-by-id.types';

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
    // ! Perform first, before records are altered
    const existingImagesRecords = await tx
      .select({ images: collectionItemsTable.images })
      .from(collectionItemsTable)
      .where(
        and(
          inArray(collectionItemsTable.id, collectionItemIds),
          eq(collectionItemsTable.userId, userId),
          sql`json_array_length(${collectionItemsTable.images}) > 0`,
        ),
      );

    // ? Save list of user deleted public IDs for removal
    const userDeletedPublicIds = existingImagesRecords.reduce<string[]>(
      (acc, { images: existingImages }, index) => {
        const deletedPublicIds = existingImages.filter((existingPublicId) => {
          const imageWasKept =
            uploadedPublicIds[index].includes(existingPublicId);

          return !imageWasKept;
        });

        return [...acc, ...deletedPublicIds];
      },
      [],
    );

    await Promise.all(
      collectionItemRecords.map(
        async ({ customFieldValues, ...collectionItem }) => {
          await Promise.all([
            // ? Update collection item records
            await tx
              .update(collectionItemsTable)
              .set(collectionItem)
              .where(
                and(
                  eq(collectionItemsTable.id, collectionItem.id),
                  eq(collectionItemsTable.userId, userId),
                ),
              ),

            // ? Delete any existing links between this collection item and custom field values
            await tx
              .delete(collectionItemsToCustomFieldValuesTable)
              .where(
                eq(
                  collectionItemsToCustomFieldValuesTable.collectionItemId,
                  collectionItem.id,
                ),
              ),
          ]);

          // ? Create brand new links between the collection items and custom field values
          const newCollectionItemToCustomFieldValueRecords = Object.values(
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

          if (newCollectionItemToCustomFieldValueRecords.length) {
            await tx
              .insert(collectionItemsToCustomFieldValuesTable)
              .values(newCollectionItemToCustomFieldValueRecords);
          }
        },
      ),
    );

    const cloudinaryTagItems = collectionItemRecords.map(
      ({ collectionId, id: collectionItemId }, index) => {
        const publicIdsForRecord = uploadedPublicIds[index];

        return {
          collectionId,
          collectionItemId,
          publicIds: publicIdsForRecord,
          userId,
        } satisfies CloudinaryTagsItem;
      },
    );

    // ? add tags to the new images on the collection item
    await addCloudinaryTagsToPublicIds(...cloudinaryTagItems);

    // ? Remove images deleted by the user, if any
    // ! Perform last just in case there is an error earlier
    await deleteCloudinaryAssetsByPublicIds(...userDeletedPublicIds);
  });
};
