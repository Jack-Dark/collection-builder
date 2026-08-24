import {
  text,
  timestamp,
  boolean,
  serial,
  json,
  snakeCase,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

import type { CustomFieldTypeDef } from './db-tables-schema.types';

export const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    })
    .notNull(),
};

export const usersTable = snakeCase.table('users', {
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  id: text('id').primaryKey(),
  image: text('image'),
  name: text('name').notNull(),
  ...timestamps,
});

export const sessionsTable = snakeCase.table('sessions', {
  expiresAt: timestamp('expires_at').notNull(),
  id: text('id').primaryKey(),
  ipAddress: text('ip_address'),
  token: text('token').notNull().unique(),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const accountsTable = snakeCase.table('accounts', {
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  accountId: text('account_id').notNull(),
  id: text('id').primaryKey(),
  idToken: text('id_token'),
  issuer: text('issuer').notNull(),
  password: text('password'),
  providerId: text('provider_id').notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const verificationsTable = snakeCase.table('verifications', {
  expiresAt: timestamp('expires_at').notNull(),
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  ...timestamps,
});

export const collectionsTable = snakeCase.table('collections', {
  /** @deprecated */
  customField1Enabled: boolean('custom_field1_enabled')
    .default(false)
    .notNull(),
  /** @deprecated */
  customField1Label: text('custom_field1_label'),
  /** @deprecated */
  customField2Enabled: boolean('custom_field2_enabled')
    .default(false)
    .notNull(),
  /** @deprecated */
  customField2Label: text('custom_field2_label'),
  /** @deprecated */
  customField3Enabled: boolean('custom_field3_enabled')
    .default(false)
    .notNull(),
  /** @deprecated */
  customField3Label: text('custom_field3_label'),
  id: serial().primaryKey(),
  name: text().notNull(),
  notes: text().notNull(),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const collectionItemsTable = snakeCase.table('collection_items', {
  collectionId: serial('collection_id')
    .notNull()
    .references(
      () => {
        return collectionsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  /** @deprecated */
  customField1Value: text('custom_field1_value').default('').notNull(),
  /** @deprecated */
  customField2Value: text('custom_field2_value').default('').notNull(),
  /** @deprecated */
  customField3Value: text('custom_field3_value').default('').notNull(),
  editionDetails: text('edition_details').default('').notNull(),
  id: serial().primaryKey(),
  images: json().$type<string[]>().default([]).notNull(),
  isSpecialEdition: boolean('is_special_edition').notNull(),
  name: text().notNull(),
  notes: text().default('').notNull(),
  userId: text('user_id')
    .default('')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const customFieldsTable = snakeCase.table('custom_fields', {
  id: serial().primaryKey(),
  name: text().notNull(),
  type: text().$type<CustomFieldTypeDef>().notNull(),
  userId: text()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  ...timestamps,
});

export const customFieldValuesTable = snakeCase.table('custom_field_values', {
  customFieldId: integer()
    .references(
      () => {
        return customFieldsTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  id: serial().primaryKey(),
  userId: text()
    .notNull()
    .default('')
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  value: json().$type<number | string | boolean>().notNull(),
  ...timestamps,
});

export const collectionsToCustomFieldsTable = snakeCase.table(
  'collections_to_custom_fields',
  {
    collectionId: integer().references(() => {
      return collectionsTable.id;
    }),
    customFieldId: integer().references(() => {
      return customFieldsTable.id;
    }),
  },
  (t) => {
    return [primaryKey({ columns: [t.collectionId, t.customFieldId] })];
  },
);

export const collectionItemsToCustomFieldValuesTable = snakeCase.table(
  'collection_items_to_custom_field_values',
  {
    collectionItemId: integer().references(() => {
      return collectionItemsTable.id;
    }),
    customFieldValueId: integer().references(() => {
      return customFieldValuesTable.id;
    }),
  },
  (t) => {
    return [
      primaryKey({ columns: [t.collectionItemId, t.customFieldValueId] }),
    ];
  },
);
