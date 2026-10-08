import { createColumnHelper } from '@tanstack/react-table';

import type { GetPaginatedCollectionsResponseDef } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';
import type { TableFeaturesDef } from '#/components/Table';

import type { CreateOrUpdateCollectionFormTypeDef } from '../../CollectionsListPage.types';

import { CollectionsListActionsCell } from './components/column-cells/CollectionsListActionsCell';
import { CollectionsListCustomFieldsCell } from './components/column-cells/CollectionsListCustomFieldsCell';
import { CollectionsListNameCell } from './components/column-cells/CollectionsListNameCell/CollectionsListNameCell';
import { CollectionsListNotesCell } from './components/column-cells/CollectionsListNotesCell/CollectionsListNotesCell';

const columnHelper = createColumnHelper<
  TableFeaturesDef,
  GetPaginatedCollectionsResponseDef['collections'][number]
>();

export type GetCollectionsListTableColumnsPropsDef = {
  form: CreateOrUpdateCollectionFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};

export const getCollectionsListTableColumns = (
  props: GetCollectionsListTableColumnsPropsDef,
) => {
  const { form, onCancel, onEditClick } = props;

  return [
    columnHelper.accessor('name', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionsListNameCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Name',
      size: 250,
    }),
    columnHelper.accessor('customFields', {
      cell: ({ row }) => {
        // TODO - UPDATE GET VALUE TO USE FORM SELECTOR FOR STATE
        return (
          <CollectionsListCustomFieldsCell
            form={form}
            index={row.index}
            rowId={row.id}
          />
        );
      },
      header: () => {
        return <span>Custom Fields</span>;
      },
      minSize: 250,
    }),
    columnHelper.accessor('notes', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionsListNotesCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Notes',
      minSize: 250,
    }),
    columnHelper.accessor('id', {
      cell: ({ row }) => {
        return (
          <CollectionsListActionsCell
            onCancel={onCancel}
            onEditClick={onEditClick}
            rowData={row.original}
            rowId={row.id}
          />
        );
      },
      header: '',
      id: 'actions',
      maxSize: 40,
    }),
  ];
};
