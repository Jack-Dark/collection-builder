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

export const user = pgTable('users', {
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

export const session = pgTable(
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
          return user.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [index('sessions_userId_idx').on(table.userId)];
  },
);

export const account = pgTable(
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
          return user.id;
        },
        { onDelete: 'cascade' },
      ),
  },
  (table) => {
    return [index('accounts_userId_idx').on(table.userId)];
  },
);

export const verification = pgTable(
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

export const games = pgTable(
  'games',
  {
    /* eslint-disable perfectionist/sort-objects */
    id: serial().primaryKey(),
    name: text().notNull(),
    system: text().notNull(),
    isSpecialEdition: boolean().notNull(),
    editionDetails: text(),
    userId: text()
      .references(
        () => {
          return user.id;
        },
        { onDelete: 'cascade' },
      )
      .notNull(),
    ...timestamps,
    /* eslint-enable perfectionist/sort-objects */
  },
  (table) => {
    return [index('games_userId_idx').on(table.userId)];
  },
);

export const userRelations = relations(user, ({ many }) => {
  return {
    accounts: many(account),
    games: many(games),
    sessions: many(session),
  };
});

export const sessionRelations = relations(session, ({ one }) => {
  return {
    user: one(user, {
      fields: [session.userId],
      references: [user.id],
    }),
  };
});

export const accountRelations = relations(account, ({ one }) => {
  return {
    user: one(user, {
      fields: [account.userId],
      references: [user.id],
    }),
  };
});
