import type { CollectionRecordDef } from '#/api/routes/collections/server/types';

import { Link } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import formatDate, { masks } from 'dateformat';

const columnHelper = createColumnHelper<CollectionRecordDef>();

export const collectionTableColumns = [
  columnHelper.accessor('name', {
    cell: ({ getValue, row }) => {
      const { id } = row.original;

      return (
        <Link params={{ id: String(id) }} to="/collections/$id">
          <p>{getValue()}</p>
        </Link>
      );
    },
    header: 'Name',
  }),
  columnHelper.accessor('notes', {
    cell: ({ getValue }) => {
      return <p>{getValue() || '-'}</p>;
    },
    header: 'Notes',
  }),
  columnHelper.accessor('createdAt', {
    cell: ({ getValue }) => {
      const date = getValue();

      return date ? (
        <p>
          {formatDate(date, `${masks.paddedShortDate} @ ${masks.shortTime}`)}
        </p>
      ) : null;
    },
    header: 'Added',
  }),
];
