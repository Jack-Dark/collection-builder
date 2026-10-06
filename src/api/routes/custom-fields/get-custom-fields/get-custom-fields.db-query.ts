import { db } from '#/api/db';

import type { GetCustomFieldsDbQueryArgsDef } from './get-custom-fields.types';

export const getCustomFieldsDbQuery = async (
  props: GetCustomFieldsDbQueryArgsDef,
) => {
  const { ids, params, userId } = props;
  const { limit, page, search, sort } = params;

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
      id: ids.length
        ? {
            in: ids,
          }
        : undefined,
      name: {
        ilike: `%${search}%`,
      },
      userId,
    },
    with: {
      details: {
        columns: {
          order: true,
        },
      },
    },
  });

  return customFields;
};
