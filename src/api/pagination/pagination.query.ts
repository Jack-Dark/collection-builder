import type { Table } from 'drizzle-orm';

import { count } from 'drizzle-orm';

import type { PaginationMetadata } from './pagination.types';

import { db } from '../db';

export const getPaginationMetadataQuery = async (props: {
  currentPage: number;
  pageSize: number;
  table: Table;
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
