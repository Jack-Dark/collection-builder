import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';

import type { GetCollectionsWithCustomFieldsRequestArgsDef } from './get-collections-with-custom-field.types';

export const getCollectionsWithCustomFieldsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCollectionsWithCustomFieldsRequestArgsDef>) => {
  const { customFieldIds } = data;
  const userId = context.user.id;

  return db.query.collectionsToCustomFields.findMany({
    where: {
      customFieldId: {
        in: customFieldIds,
      },
      userId,
    },
  });
};
