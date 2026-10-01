import { db } from '#/api/db';

import type { GetCustomFieldsRequestArgsDef } from './get-custom-fields.types';

export const getCustomFieldsDbQuery = async (
  props: GetCustomFieldsRequestArgsDef['params'] & { userId: string },
) => {
  const { limit, page, search, sort, userId } = props;

  const customFields = await db.query.customFields.findMany({
    columns: {
      id: true,
      name: true,
      type: true,
    },
    limit,
    offset: (page - 1) * limit,
    orderBy: {
      [sort.field]: sort.direction,
    },
    where: {
      name: {
        ilike: `%${search}%`,
      },
      userId,
    },
  });

  return customFields;
};
