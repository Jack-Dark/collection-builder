import type { SQL } from 'drizzle-orm';

import { eq, gte, inArray, lte, sql } from 'drizzle-orm';
import {
  text,
  timestamp,
  boolean,
  serial,
  json,
  snakeCase,
  integer,
} from 'drizzle-orm/pg-core';

import type { CustomFieldTypeDef } from './db-tables-schema.types';
import type { CustomFieldValueDef } from './routes/custom-field-values/custom-field-values.types';

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
  id: serial().primaryKey(),
  name: text().notNull(),
  notes: text().notNull().default(''),
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
  data: json().$type<{ value: string | number | boolean }>().notNull(),
  id: serial().primaryKey(),
  userId: text()
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  ...timestamps,
});

export const equalsCustomFieldValue = (
  value:
    | (CustomFieldValueDef | null)
    | (CustomFieldValueDef | null)[]
    | { max: number; min: number },
) => {
  const queries: SQL[] = [];

  const isArray = Array.isArray(value);
  if (isArray) {
    queries.push(inArray(sql`${customFieldValuesTable.data}->>'value'`, value));
  } else if (value && typeof value === 'object') {
    const { max, min } = value;

    queries.push(gte(sql`${customFieldValuesTable.data}->>'value'`, min));
    queries.push(lte(sql`${customFieldValuesTable.data}->>'value'`, max));
  } else {
    queries.push(eq(sql`${customFieldValuesTable.data}->>'value'`, value));
  }

  return queries;
};

export const collectionsToCustomFieldsTable = snakeCase.table(
  'collections_to_custom_fields',
  {
    collectionId: integer()
      .notNull()
      .references(
        () => {
          return collectionsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    customFieldId: integer()
      .notNull()
      .references(
        () => {
          return customFieldsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    id: serial().primaryKey(),
    order: integer().notNull().default(0),
    userId: text()
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
);

export const collectionItemsToCustomFieldValuesTable = snakeCase.table(
  'collection_items_to_custom_field_values',
  {
    collectionItemId: integer()
      .notNull()
      .references(
        () => {
          return collectionItemsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    customFieldValueId: integer()
      .notNull()
      .references(
        () => {
          return customFieldValuesTable.id;
        },
        { onDelete: 'cascade' },
      ),
    id: serial().primaryKey(),
    userId: text()
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
  },
);
