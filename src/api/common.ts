import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  /* eslint-disable perfectionist/sort-objects */
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
  /* eslint-enable perfectionist/sort-objects */
};

export type TimestampsDef = typeof timestamps;
