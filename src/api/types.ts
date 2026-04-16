import type { timestamps, usersTable } from './schema';

export type UserRecordDef = typeof usersTable.$inferSelect;

export type NewUserRecordDef = typeof usersTable.$inferInsert;

export type UpdateUserRecordDef = Partial<
  Omit<UserRecordDef, 'id' | keyof TimestampsDef>
>;

export type TimestampsDef = typeof timestamps;
