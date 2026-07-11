import type { PaginationMetadata } from './pagination.types';

export const getPaginationMetadataQuery = (props: {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}) => {
  const { currentPage, pageSize, totalRecords } = props;

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
