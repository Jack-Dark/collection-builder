import type { SQL, Subquery, ColumnsSelection } from 'drizzle-orm';
import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';
import type { PgViewBase } from 'drizzle-orm/pg-core/view-base';

import { count } from 'drizzle-orm';

import type { PaginationMetadata } from './types';

import { db } from '../db';

export const getPaginationMetadataQuery = async (props: {
  currentPage: number;
  pageSize: number;
  table:
    | SQL<unknown>
    | PgTable<TableConfig>
    | Subquery<string, Record<string, unknown>>
    | PgViewBase<string, boolean, ColumnsSelection>;
}) => {
  const { currentPage, pageSize, table } = props;

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(table);

  const totalPages = Math.ceil(totalRecords / pageSize);

  const metadata: PaginationMetadata = {
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    pageSize,
    totalPages,
    totalRecords,
  };

  return metadata;
};
