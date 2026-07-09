import type { AccessorKeyColumnDefBase } from '@tanstack/react-table';

import { useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import formatDate, { masks } from 'dateformat';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/server/types';
import type { CollectionRecordDef } from '#/api/routes/collections/server/types';

import { useDeleteCollectionItem } from '#/api/routes/collection-items/client/hooks';

import { TableCellActionsMenu } from '../../components/TableCellActionsMenu';
import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { useCollectionItemsFormStore } from './CollectionItemsPage';

const columnHelper = createColumnHelper<CollectionItemRecordDef>();

export const getCollectionItemsTableColumns = (props: CollectionRecordDef) => {
  const {
    customField1Enabled,
    customField1Label,
    customField2Enabled,
    customField2Label,
    customField3Enabled,
    customField3Label,
  } = props;

  return [
    columnHelper.accessor('name', {
      cell: ({ getValue }) => {
        return <p>{getValue()}</p>;
      },
      header: 'Name',
      size: 200,
    }),
    customField1Enabled &&
      columnHelper.accessor('customField1Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField1Label || '',
      }),
    customField2Enabled &&
      columnHelper.accessor('customField2Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField2Label || '',
      }),
    customField3Enabled &&
      columnHelper.accessor('customField3Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField3Label || '',
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

        return date ? <p>{formatDate(date, masks.paddedShortDate)}</p> : null;
      },
      header: 'Added',
    }),
    columnHelper.accessor('id', {
      cell: ({ getValue, row }) => {
        const router = useRouter();

        const { isPending: isDeletePending, onDeleteCollectionItem } =
          useDeleteCollectionItem();

        const { resetCollectionItemFormValues, setCollectionItemFormValues } =
          useCollectionItemsFormStore();

        const collectionItemId = getValue();

        const { getIsEditingRowId, resetEditingRowIds, setEditingRowIds } =
          useEditingCollectionItemsRowIds();

        const isEditingRow = getIsEditingRowId(collectionItemId);

        return (
          <TableCellActionsMenu
            deleteIsDisabled={isDeletePending}
            deleteOnClick={async () => {
              await onDeleteCollectionItem({
                data: { collectionItemId },
              });
              router.invalidate();
            }}
            editIsDisabled={isDeletePending}
            editOnClick={async (row) => {
              setEditingRowIds([collectionItemId]);
              setCollectionItemFormValues(row);
            }}
            isEditing={isEditingRow}
            onCancelEdit={() => {
              resetEditingRowIds();
              resetCollectionItemFormValues();
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
  ].filter(Boolean) as AccessorKeyColumnDefBase<CollectionItemRecordDef>[];
};
