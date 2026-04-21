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
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ {
      return new Date();
    })
    .notNull(),
  deletedAt: timestamp(),
  /* eslint-enable perfectionist/sort-objects */
};

export const usersTable = pgTable('users', {
  createdAt: timestamp().defaultNow().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  id: text().primaryKey(),
  image: text(),
  name: text().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ {
      return new Date();
    })
    .notNull(),
});

export const sessionsTable = pgTable(
  'sessions',
  {
    createdAt: timestamp().defaultNow().notNull(),
    expiresAt: timestamp().notNull(),
    id: text().primaryKey(),
    ipAddress: text(),
    token: text().notNull().unique(),
    updatedAt: timestamp()
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date();
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
    accessTokenExpiresAt: timestamp(),
    accountId: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    id: text(),
    idToken: text(),
    password: text(),
    providerId: text().notNull(),
    refreshToken: text(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    updatedAt: timestamp()
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date();
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
    createdAt: timestamp().defaultNow().notNull(),
    expiresAt: timestamp().notNull(),
    id: text().primaryKey(),
    identifier: text().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date();
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
    customField1Enabled: boolean().default(false),
    customField1Label: text(),
    customField2Enabled: boolean().default(false),
    customField2Label: text(),
    customField3Enabled: boolean().default(false),
    customField3Label: text(),
    id: serial().primaryKey(),
    name: text().notNull(),
    notes: text(),
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
  'collection-items',
  {
    /* eslint-disable perfectionist/sort-objects */
    id: serial().primaryKey(),
    name: text().notNull(),
    system: text().notNull(),
    isSpecialEdition: boolean().notNull(),
    editionDetails: text(),
    notes: text(),
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
