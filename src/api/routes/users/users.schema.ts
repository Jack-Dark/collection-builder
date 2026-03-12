import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../../types';

export const usersTable = pgTable('users', {
  /* eslint-disable perfectionist/sort-objects */
  id: serial().primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().unique().notNull(),
  hashedPassword: varchar({ length: 256 }).notNull().default('unset'),
  ...timestamps,
  /* eslint-enable perfectionist/sort-objects */
});
