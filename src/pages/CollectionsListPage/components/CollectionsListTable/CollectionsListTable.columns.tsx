import type { AppFieldExtendedReactFormApi } from '@tanstack/react-form';

import { createColumnHelper } from '@tanstack/react-table';

import type { GetPaginatedCollectionsResponseDef } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';

import type { CreateOrUpdateCollectionFormDataSchemaDef } from '../../CollectionsListPage.types';

import { CollectionsListActionsCell } from './components/column-cells/CollectionsListActionsCell';
import { CollectionsListCustomFieldCell } from './components/column-cells/CollectionsListCustomFieldCell/CollectionsListCustomFieldCell';
import { CollectionsListNameCell } from './components/column-cells/CollectionsListNameCell/CollectionsListNameCell';
import { CollectionsListNotesCell } from './components/column-cells/CollectionsListNotesCell/CollectionsListNotesCell';

const columnHelper =
  createColumnHelper<
    GetPaginatedCollectionsResponseDef['collections'][number]
  >();

export type GetCollectionsListTableColumnsPropsDef = {
  form: AppFieldExtendedReactFormApi<
    CreateOrUpdateCollectionFormDataSchemaDef,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
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
    columnHelper.accessor('customField1Label', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionsListCustomFieldCell
            enabledFieldName="customField1Enabled"
            form={form}
            index={row.index}
            label="Custom Field 1 Label"
            labelFieldName="customField1Label"
            rowId={row.id}
            value={getValue() || ''}
          />
        );
      },
      header: 'Custom Field 1',
      size: 200,
    }),
    columnHelper.accessor('customField2Label', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionsListCustomFieldCell
            enabledFieldName="customField2Enabled"
            form={form}
            index={row.index}
            label="Custom Field 2 Label"
            labelFieldName="customField2Label"
            rowId={row.id}
            value={getValue() || ''}
          />
        );
      },
      header: 'Custom Field 2',
      size: 200,
    }),
    columnHelper.accessor('customField3Label', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionsListCustomFieldCell
            enabledFieldName="customField3Enabled"
            form={form}
            index={row.index}
            label="Custom Field 3 Label"
            labelFieldName="customField3Label"
            rowId={row.id}
            value={getValue() || ''}
          />
        );
      },
      header: 'Custom Field 3',
      size: 200,
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
      minSize: 210,
    }),
    columnHelper.accessor('id', {
      cell: (context) => {
        return (
          <CollectionsListActionsCell
            onCancel={onCancel}
            onEditClick={onEditClick}
            {...context}
          />
        );
      },
      header: '',
      id: 'actions',
      size: 40,
    }),
  ];
};
