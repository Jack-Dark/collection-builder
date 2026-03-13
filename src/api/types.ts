import type { timestamps, user } from './schema';

export type UserRecordDef = typeof user.$inferSelect;

export type NewUserRecordDef = typeof user.$inferInsert;

export type UpdateUserRecordDef = Partial<
  Omit<UserRecordDef, 'id' | keyof TimestampsDef>
>;

export type TimestampsDef = typeof timestamps;
