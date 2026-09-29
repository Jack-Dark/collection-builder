import { eq } from 'drizzle-orm';

import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';

export const getCustomFieldsDbQuery = async (props: { userId: string }) => {
  const { userId } = props;

  const customFields = await db
    .select()
    .from(customFieldsTable)
    .where(eq(customFieldsTable.userId, userId));

  return customFields;
};
