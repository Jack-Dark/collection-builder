import { db } from '#/api/db';

import type { GetCollectionsWithCustomFieldsDbQueryArgsDef } from './get-collections-with-custom-field.types';

export const getCollectionsWithCustomFieldsDbQuery = async (
  props: GetCollectionsWithCustomFieldsDbQueryArgsDef,
) => {
  const { customFieldIds, userId } = props;

  return db.query.collectionsToCustomFields.findMany({
    where: {
      customFieldId: {
        in: customFieldIds,
      },
      userId,
    },
  });
};
