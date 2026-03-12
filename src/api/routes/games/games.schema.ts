import { usersTable } from '#/api/routes/users/users.schema';
import { pgTable, serial, text, boolean, integer } from 'drizzle-orm/pg-core';

import { timestamps } from '../../types';

export const gamesTable = pgTable('games', {
  /* eslint-disable perfectionist/sort-objects */
  id: serial().primaryKey(),
  name: text().notNull(),
  system: text().notNull(),
  isSpecialEdition: boolean().notNull(),
  editionDetails: text(),
  userId: integer().references(() => {
    return usersTable.id;
  }),
  ...timestamps,
  /* eslint-enable perfectionist/sort-objects */
});
