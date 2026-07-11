import type { Getter, Row } from '@tanstack/react-table';

import { Link, useRouter } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';

import type { CollectionRecordDef } from '#/api/routes/collections/server/types';

import { useDeleteCollection } from '#/api/routes/collections/client/hooks';
import { TableCellActionsMenu } from '#/components/TableCellActionsMenu';

import { useCollectionsListFormStore } from './CollectionsListPage';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

const columnHelper = createColumnHelper<CollectionRecordDef>();

const CustomFieldCell = <TNum extends 1 | 2 | 3>(props: {
  customFieldNum: TNum;
  getValue: Getter<string | null>;
  row: Row<CollectionRecordDef>;
}) => {
  const { customFieldNum, getValue, row } = props;

  const isEnabled = row.original[`customField${customFieldNum}Enabled`];
  const isRequired = row.original[`customField${customFieldNum}Required`];

  return isEnabled ? (
    <p className="flex align-items-center">
      {getValue()}
      {` - (${isRequired ? 'required' : 'optional'})`}
    </p>
  ) : (
    <p>-</p>
  );
};

export const getCollectionsListTableColumns = () => {
  return [
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
      size: 200,
    }),
    columnHelper.accessor('customField1Label', {
      cell: ({ getValue, row }) => {
        return (
          <CustomFieldCell customFieldNum={1} getValue={getValue} row={row} />
        );
      },
      header: 'Custom Field 1',
    }),
    columnHelper.accessor('customField2Label', {
      cell: ({ getValue, row }) => {
        return (
          <CustomFieldCell customFieldNum={2} getValue={getValue} row={row} />
        );
      },
      header: 'Custom Field 2',
    }),
    columnHelper.accessor('customField3Label', {
      cell: ({ getValue, row }) => {
        return (
          <CustomFieldCell customFieldNum={3} getValue={getValue} row={row} />
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
      minSize: 210,
    }),
    columnHelper.accessor('id', {
      cell: ({ getValue, row }) => {
        const router = useRouter();

        const { isPending: isDeletePending, onDeleteCollection } =
          useDeleteCollection();

        const { resetCollectionFormValues, setCollectionFormValues } =
          useCollectionsListFormStore();

        const collectionId = getValue();

        const { getIsEditingRowId, resetEditingRowIds, setEditingRowIds } =
          useEditingCollectionsRowIds();

        const isEditingRow = getIsEditingRowId(collectionId);

        return (
          <TableCellActionsMenu
            deleteIsDisabled={isDeletePending}
            deleteOnClick={async () => {
              await onDeleteCollection({ data: { collectionId } });
              router.invalidate();
            }}
            editIsDisabled={isDeletePending}
            editOnClick={async (row) => {
              setEditingRowIds([collectionId]);
              setCollectionFormValues(row);
            }}
            isEditing={isEditingRow}
            onCancelEdit={() => {
              resetEditingRowIds();
              resetCollectionFormValues();
            }}
            row={row}
          />
        );
      },
      header: '',
      id: 'actions',
      size: 40,
    }),
  ];
};
