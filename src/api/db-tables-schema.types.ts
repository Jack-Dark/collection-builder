import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { timestamps, usersTable } from './db-tables-schema';

export type UserRecordDef = InferSelectModel<typeof usersTable>;

export type CreateNewUserRecordDef = InferInsertModel<typeof usersTable>;

export type TimestampsDef = typeof timestamps;
