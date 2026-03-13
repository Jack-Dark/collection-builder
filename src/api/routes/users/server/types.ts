import type { TimestampsDef } from '#/api/common';

import type { usersTable } from './schema';

export type UserRecordDef = typeof usersTable.$inferSelect;

export type NewUserRecordDef = typeof usersTable.$inferInsert;

export type UpdateUserRecordDef = Partial<
  Omit<UserRecordDef, 'id' | keyof TimestampsDef>
>;
