import { and, count, eq, isNull } from 'drizzle-orm';
import { ReasonPhrases } from 'http-status-codes';

import { db } from '#/api/db';
import {
  collectionsToCustomFieldsTable,
  customFieldsTable,
} from '#/api/db-tables-schema';

export const deleteCustomFieldsDbQuery = async (props: {
  collectionId: number;
  ids: number[];
  userId: string;
}) => {
  const { collectionId, ids, userId } = props;

  await db.transaction(async (tx) => {
    for (const id of ids) {
      const matchesUserAndIds = and(
        eq(customFieldsTable.userId, userId),
        isNull(customFieldsTable.deletedAt),
        eq(customFieldsTable.id, id),
      );

      const [{ collectionsLinkedToCustomField }] = await tx
        .select({ collectionsLinkedToCustomField: count() })
        .from(collectionsToCustomFieldsTable)
        .where(eq(collectionsToCustomFieldsTable.customFieldId, id));

      if (collectionsLinkedToCustomField <= 0) {
        throw new Error(ReasonPhrases.NOT_FOUND);
      } else if (collectionsLinkedToCustomField === 1) {
        // ? if only one match, delete the custom field
        const { rowCount } = await tx
          .delete(customFieldsTable)
          .where(matchesUserAndIds);

        if (rowCount === 0) {
          throw new Error(ReasonPhrases.NOT_FOUND);
        }
      } else {
        // ? otherwise just delete the references to the
        const { rowCount } = await tx
          .delete(collectionsToCustomFieldsTable)
          .where(
            and(
              eq(collectionsToCustomFieldsTable.customFieldId, id),
              eq(collectionsToCustomFieldsTable.collectionId, collectionId),
            ),
          );

        if (rowCount === 0) {
          throw new Error(ReasonPhrases.NOT_FOUND);
        }
      }
    }
  });
};
