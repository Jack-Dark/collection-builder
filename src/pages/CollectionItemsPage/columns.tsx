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
    columnHelper.accessor('images', {
      cell: ({ getValue, row }) => {
        const images = getValue();

        return images.length ? (
          images.map((src, index) => {
            return (
              <img
                alt={`${row.original.name} thumbnail ${index + 1}`}
                key={src}
                src={src}
              />
            );
          })
        ) : (
          <p>-</p>
        );
      },
      header: 'Images',
      minSize: 200,
    }),
    customField1Enabled &&
      columnHelper.accessor('customField1Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField1Label || '',
        minSize: 200,
      }),
    customField2Enabled &&
      columnHelper.accessor('customField2Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField2Label || '',
        minSize: 200,
      }),
    customField3Enabled &&
      columnHelper.accessor('customField3Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField3Label || '',
        minSize: 200,
      }),
    columnHelper.accessor('editionDetails', {
      cell: ({ getValue }) => {
        return <p>{getValue() || '-'}</p>;
      },
      header: 'Edition',
      minSize: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ getValue }) => {
        return <p>{getValue() || '-'}</p>;
      },
      header: 'Notes',
      minSize: 210,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ getValue }) => {
        const date = getValue();

        return date ? <p>{formatDate(date, masks.paddedShortDate)}</p> : null;
      },
      header: 'Added',
      size: 120,
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
      header: '',
      id: 'actions',
      size: 40,
    }),
  ].filter(Boolean) as AccessorKeyColumnDefBase<CollectionItemRecordDef>[];
};
