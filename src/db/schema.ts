import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  varchar,
  serial,
} from 'drizzle-orm/pg-core';

const timestamps = {
  /* eslint-disable perfectionist/sort-objects */
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
  /* eslint-enable perfectionist/sort-objects */
};

export const gamesDbSchema = pgTable('games', {
  /* eslint-disable perfectionist/sort-objects */
  id: serial().primaryKey(),
  name: text().notNull(),
  system: text().notNull(),
  isSpecialEdition: boolean().notNull(),
  editionDetails: text().notNull(),
  userId: integer().references(() => {
    return usersDbSchema.id;
  }),
  ...timestamps,
  /* eslint-enable perfectionist/sort-objects */
});

export const usersDbSchema = pgTable('users', {
  /* eslint-disable perfectionist/sort-objects */
  id: serial().primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().unique().notNull(),
  hashedPassword: varchar({ length: 256 }).notNull().default('unset'),
  ...timestamps,
  /* eslint-enable perfectionist/sort-objects */
});

export type UserDef = typeof usersDbSchema.$inferSelect;

export type NewUserDef = typeof usersDbSchema.$inferInsert;
