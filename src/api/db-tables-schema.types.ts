import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { usersTable } from './db-tables-schema';

export type UserRecordDef = InferSelectModel<typeof usersTable>;

export type CreateNewUserRecordDef = InferInsertModel<typeof usersTable>;

/**
 * @example export type YOUR_RESPONSE_TYPE = QueryResponseDef<typeof YOUR_DB_QUERY_FUNCTION>;
 */
export type QueryResponseDef<TDbQuery extends (...args: any) => any> = Awaited<
  ReturnType<TDbQuery>
>;
