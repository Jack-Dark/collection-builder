import { Link, useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import formatDate, { masks } from 'dateformat';

import type { CollectionRecordDef } from '#/api/routes/collections/server/types';

import {
  useDeleteCollection,
  useUpdateCollection,
} from '#/api/routes/collections/client/hooks';
import { TableCellActionsMenu } from '#/components/TableCellActionsMenu';

const columnHelper = createColumnHelper<CollectionRecordDef>();

export const collectionTableColumns = [
  columnHelper.accessor('name', {
    cell: ({ getValue, row }) => {
      const { id } = row.original;
      const value = getValue();
      // const isEditing = row.getIsSelected();

      return (
        <Link params={{ id: String(id) }} to="/collections/$id">
          <p>{value}</p>
        </Link>
      );
    },
    header: 'Name',
  }),

  columnHelper.accessor('customField1Label', {
    cell: ({ getValue, row }) => {
      return (
        <p>{row.original.customField1Enabled ? (getValue() ?? '') : '-'}</p>
      );
    },
    header: 'Custom Field 1',
  }),
  columnHelper.accessor('customField2Label', {
    cell: ({ getValue, row }) => {
      return (
        <p>{row.original.customField2Enabled ? (getValue() ?? '') : '-'}</p>
      );
    },
    header: 'Custom Field 2',
  }),
  columnHelper.accessor('customField3Label', {
    cell: ({ getValue, row }) => {
      return (
        <p>{row.original.customField3Enabled ? (getValue() ?? '') : '-'}</p>
      );
    },
    header: 'Custom Field 3',
  }),
  columnHelper.accessor('notes', {
    cell: ({ getValue }) => {
      const value = getValue();
      // const isEditing = row.getIsSelected();

      return <p>{value || '-'}</p>;
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
  columnHelper.accessor('id', {
    cell: ({ row }) => {
      const router = useRouter();

      const { isPending: isUpdatePending, onUpdateCollection } =
        useUpdateCollection();

      const { isPending: isDeletePending, onDeleteCollection } =
        useDeleteCollection();

      const isProcessing = isUpdatePending || isDeletePending;

      return (
        <TableCellActionsMenu
          deleteIsDisabled={isProcessing}
          deleteOnClick={async (data) => {
            await onDeleteCollection({ data: { collectionId: data.id } });
            router.invalidate();
          }}
          editIsDisabled={isProcessing}
          editOnClick={async (data) => {
            await onUpdateCollection({ data });
          }}
          row={row}
        />
      );
    },
    header: () => {
      return <p className="text-right">Actions</p>;
    },
    id: 'actions',
    size: 0,
  }),
];
