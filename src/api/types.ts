import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { timestamps, usersTable } from './schema';

export type UserRecordDef = InferSelectModel<typeof usersTable>;

export type NewUserRecordDef = InferInsertModel<typeof usersTable>;

export type UpdateUserRecordDef = Partial<
  Omit<UserRecordDef, 'id' | keyof TimestampsDef>
>;

export type TimestampsDef = typeof timestamps;
