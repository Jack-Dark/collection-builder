import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  serial,
} from 'drizzle-orm/pg-core';

export const timestamps = {
  /* eslint-disable perfectionist/sort-objects */
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ {
      return new Date().toDateString();
    })
    .notNull(),
  deletedAt: timestamp({ mode: 'string' }),
  /* eslint-enable perfectionist/sort-objects */
};

export const usersTable = pgTable('users', {
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  id: text().primaryKey(),
  image: text(),
  name: text().notNull(),
  updatedAt: timestamp({ mode: 'string' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ {
      return new Date().toDateString();
    })
    .notNull(),
});

export const sessionsTable = pgTable(
  'sessions',
  {
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    expiresAt: timestamp({ mode: 'string' }).notNull(),
    id: text().primaryKey(),
    ipAddress: text(),
    token: text().notNull().unique(),
    updatedAt: timestamp({ mode: 'string' })
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date().toDateString();
      })
      .notNull(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [index('sessions_userId_idx').on(table.userId)];
  },
);

export const accountsTable = pgTable(
  'accounts',
  {
    accessToken: text(),
    accessTokenExpiresAt: timestamp({ mode: 'string' }),
    accountId: text().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    id: text(),
    idToken: text(),
    password: text(),
    providerId: text().notNull(),
    refreshToken: text(),
    refreshTokenExpiresAt: timestamp({ mode: 'string' }),
    scope: text(),
    updatedAt: timestamp({ mode: 'string' })
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date().toDateString();
      })
      .notNull(),
    userId: text()
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [index('accounts_userId_idx').on(table.userId)];
  },
);

export const verificationsTable = pgTable(
  'verifications',
  {
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    expiresAt: timestamp({ mode: 'string' }).notNull(),
    id: text().primaryKey(),
    identifier: text().notNull(),
    updatedAt: timestamp({ mode: 'string' })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date().toDateString();
      })
      .notNull(),
    value: text('value').notNull(),
  },
  (table) => {
    return [index('verifications_identifier_idx').on(table.identifier)];
  },
);

export const collectionsTable = pgTable(
  'collections',
  {
    customField1Enabled: boolean().notNull().default(false),
    customField1Label: text(),
    customField1Required: boolean().notNull().default(false),
    customField2Enabled: boolean().notNull().default(false),
    customField2Label: text(),
    customField2Required: boolean().notNull().default(false),
    customField3Enabled: boolean().notNull().default(false),
    customField3Label: text(),
    customField3Required: boolean().notNull().default(false),
    id: serial().primaryKey(),
    name: text().notNull(),
    notes: text().notNull(),
    userId: text()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      )
      .notNull(),
    ...timestamps,
  },
  (table) => {
    return [index('collections_userId_idx').on(table.userId)];
  },
);

export const collectionItemsTable = pgTable(
  'collection_items',
  {
    /* eslint-disable perfectionist/sort-objects */
    id: serial().primaryKey(),
    name: text().notNull(),
    isSpecialEdition: boolean().notNull(),
    editionDetails: text(),
    notes: text(),
    customField1Value: text(),
    customField2Value: text(),
    customField3Value: text(),
    userId: text()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      )
      .notNull(),
    collectionId: serial()
      .references(
        () => {
          return collectionsTable.id;
        },
        { onDelete: 'cascade' },
      )
      .notNull(),
    ...timestamps,
    /* eslint-enable perfectionist/sort-objects */
  },
  (table) => {
    return [
      index('collectionsItems_userId_idx').on(table.userId),
      index('collectionsItems_collectionId_idx').on(table.collectionId),
    ];
  },
);

export const usersRelations = relations(usersTable, ({ many }) => {
  return {
    accounts: many(accountsTable),
    collections: many(collectionsTable),
    collectionsItems: many(collectionItemsTable),
    sessions: many(sessionsTable),
  };
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [sessionsTable.userId],
      references: [usersTable.id],
    }),
  };
});

export const accountsRelations = relations(accountsTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [accountsTable.userId],
      references: [usersTable.id],
    }),
  };
});
