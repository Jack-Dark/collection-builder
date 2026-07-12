import type { InferModelFromColumns, SQL } from 'drizzle-orm';

import { inArray, and, eq, ilike, isNull } from 'drizzle-orm';

import { db } from '#/api/db';

import type {
  CollectionItemRecordDef,
  InsertCollectionItemRecordDef,
  UpdateCollectionItemSchemaDef,
} from '../types';

import { collectionItemsTable } from '../../../db-tables-schema';

// TODO - DELETE
const getMatchesUserIdAndNotDeleted = (userId: string) => {
  return and(
    eq(collectionItemsTable.userId, userId),
    isNull(collectionItemsTable.deletedAt),
  );
};

export type CollectionItemsTableColumn = keyof CollectionItemRecordDef;

export const formatFilters = <
  TTable extends InferModelFromColumns<
    {
      customField1Value: any;
      customField2Value: any;
      customField3Value: any;
      name: any;
    } & Record<string, any>
  >,
>(props: {
  filters: {
    customField1: string[];
    customField2: string[];
    customField3: string[];
  };
  search: string | undefined;
  table: TTable;
}): SQL | undefined => {
  const { filters = {}, search = '', table } = props;

  const getCustomFieldColumnName = (key: string) => {
    const num = Number(key.replace(/\D/g, ''));
    const columnName = `customField${num}Value` as const;

    return columnName;
  };

  const filterItems = Object.entries(filters)
    .filter(([key]) => {
      const columnName = getCustomFieldColumnName(key);
      const isTableColumn = table.hasOwnProperty(columnName);

      return isTableColumn;
    })
    .map(([key, value]) => {
      const columnName = getCustomFieldColumnName(key);

      const isArray = Array.isArray(value);

      if (isArray) {
        if (value.length) {
          return inArray(table[columnName], value as string[]);
        }
      } else {
        return eq(table[columnName], value as string);
      }
    });

  const cleanSearchTerm = search.trim();

  return and(
    ...filterItems,
    cleanSearchTerm ? ilike(table.name, `%${cleanSearchTerm}%`) : undefined,
  );
};

export const getCollectionItemByIdDbQuery = async (props: {
  collectionItemId: number;
  userId: string;
}) => {
  const { collectionItemId, userId } = props;

  const [record] = await db
    .select()
    .from(collectionItemsTable)
    .where(
      and(
        eq(collectionItemsTable.id, collectionItemId),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    );

  return record;
};

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
            getMatchesUserIdAndNotDeleted(userId),
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
      getMatchesUserIdAndNotDeleted(userId),
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
        getMatchesUserIdAndNotDeleted(userId),
      ),
    );
};
