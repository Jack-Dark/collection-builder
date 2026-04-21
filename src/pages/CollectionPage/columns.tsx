import type { CollectionItemRecordDef } from '#/api/routes/collection-items/server/types';

import { useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import {
  useDeleteCollectionItem,
  useUpdateCollectionItem,
} from '#/api/routes/collection-items/client/hooks';
import formatDate, { masks } from 'dateformat';

import { TableCellActionsMenu } from '../../components/TableCellActionsMenu';

const columnHelper = createColumnHelper<CollectionItemRecordDef>();

export const collectionItemsTableColumns = [
  columnHelper.accessor('name', {
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
    header: 'Name',
  }),
  columnHelper.accessor('system', {
    cell: ({ getValue }) => {
      return <p>{getValue()}</p>;
    },
    header: 'System',
  }),
  columnHelper.accessor('editionDetails', {
    cell: ({ getValue }) => {
      return <p>{getValue() || '-'}</p>;
    },
    header: 'Edition',
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
  columnHelper.accessor('id', {
    cell: ({ row }) => {
      const router = useRouter();

      const { isPending: isUpdatePending, onUpdateCollectionItem } =
        useUpdateCollectionItem();

      const { isPending: isDeletePending, onDeleteCollectionItem } =
        useDeleteCollectionItem();

      const isProcessing = isUpdatePending || isDeletePending;

      return (
        <TableCellActionsMenu
          deleteIsDisabled={isProcessing}
          deleteOnClick={async (data) => {
            await onDeleteCollectionItem({ data: data.id });
            router.invalidate();
          }}
          editIsDisabled={isProcessing}
          editOnClick={async (data) => {
            await onUpdateCollectionItem({ data });
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
