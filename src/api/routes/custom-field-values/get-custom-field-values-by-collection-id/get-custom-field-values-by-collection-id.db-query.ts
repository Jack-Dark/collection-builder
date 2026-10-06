import { db } from '#/api/db';

import type { GetCustomFieldValuesByCustomFieldIdDbQueryArgsDef } from './get-custom-field-values-by-collection-id.types';

export const getCustomFieldValuesByCustomFieldIdDbQuery = async ({
  id: customFieldId,

  userId,
}: GetCustomFieldValuesByCustomFieldIdDbQueryArgsDef) => {
  return await db.query.customFieldValues.findMany({
    columns: {
      data: true,
      id: true,
    },
    where: {
      customFieldId,
      userId,
    },
  });
};
