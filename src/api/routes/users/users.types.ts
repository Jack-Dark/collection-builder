import type { usersTable } from './users.schema';

export type UserRecordDef = typeof usersTable.$inferSelect;

export type NewUserRecordDef = typeof usersTable.$inferInsert;
