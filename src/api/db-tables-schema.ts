import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  serial,
  json,
  uniqueIndex,
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  id: text('id').primaryKey(),
  image: text('image'),
  name: text('name').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ {
      return new Date();
    })
    .notNull(),
});

export const sessionsTable = pgTable(
  'sessions',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    id: text('id').primaryKey(),
    ipAddress: text('ip_address'),
    token: text('token').notNull().unique(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date();
      })
      .notNull(),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [index('session_userId_idx').on(table.userId)];
  },
);

export const accountsTable = pgTable(
  'accounts',
  {
    accessToken: text('access_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    accountId: text('account_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    id: text('id').primaryKey(),
    idToken: text('id_token'),
    issuer: text('issuer').notNull(),
    password: text('password'),
    providerId: text('provider_id').notNull(),
    refreshToken: text('refresh_token'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date();
      })
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [
      uniqueIndex('account_issuer_accountId_uidx').on(
        table.issuer,
        table.accountId,
      ),
      index('accounts_userId_idx').on(table.userId),
    ];
  },
);

export const verificationsTable = pgTable(
  'verifications',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ {
        return new Date();
      })
      .notNull(),
    value: text('value').notNull(),
  },
  (table) => {
    return [index('verification_identifier_idx').on(table.identifier)];
  },
);

export const collectionsTable = pgTable(
  'collections',
  {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    customField1Enabled: boolean('custom_field1_enabled')
      .default(false)
      .notNull(),
    customField1Label: text('custom_field1_label'),
    customField2Enabled: boolean('custom_field2_enabled')
      .default(false)
      .notNull(),
    customField2Label: text('custom_field2_label'),
    customField3Enabled: boolean('custom_field3_enabled')
      .default(false)
      .notNull(),
    customField3Label: text('custom_field3_label'),
    deletedAt: timestamp('deleted_at'),
    id: serial().primaryKey(),
    name: text().notNull(),
    notes: text().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => {
        return new Date();
      })
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [
      index('collections_userId_idx').using(
        'btree',
        table.userId.asc().nullsLast(),
      ),
    ];
  },
);

export const collectionItemsTable = pgTable(
  'collection_items',
  {
    collectionId: serial('collection_id')
      .notNull()
      .references(
        () => {
          return collectionsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    customField1Value: text('custom_field1_value').default('').notNull(),
    customField2Value: text('custom_field2_value').default('').notNull(),
    customField3Value: text('custom_field3_value').default('').notNull(),
    deletedAt: timestamp('deleted_at'),
    editionDetails: text('edition_details').default('').notNull(),
    id: serial().primaryKey(),
    images: json().$type<string[]>().default([]).notNull(),
    isSpecialEdition: boolean('is_special_edition').notNull(),
    name: text().notNull(),
    notes: text().default('').notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => {
        return new Date();
      })
      .notNull(),
    userId: text('user_id')
      .default('')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [
      index('collectionsItems_collectionId_idx').using(
        'btree',
        table.collectionId.asc().nullsLast(),
      ),
      index('collectionsItems_userId_idx').using(
        'btree',
        table.userId.asc().nullsLast(),
      ),
    ];
  },
);
