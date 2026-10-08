import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';

import type { GetCustomFieldValuesByCustomFieldIdRequestArgsDef } from './get-custom-field-values-by-collection-id.types';

export const getCustomFieldValuesByCustomFieldIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCustomFieldValuesByCustomFieldIdRequestArgsDef>) => {
  const { id } = data;
  const userId = context.user.id;

  return await db.query.customFieldValues.findMany({
    columns: {
      data: true,
      id: true,
    },
    where: {
      customFieldId: id,
      userId,
    },
  });
};
