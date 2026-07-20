import type { AppFieldExtendedReactFormApi } from '@tanstack/react-form';
import type { Getter, Row } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';

import type { GetPaginatedCollectionsResponseDef } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';

import { CheckboxField } from '#/components/Fields/CheckboxField';
import { useLastSelectedTableRowsStore } from '#/components/Table';

import type { CreateOrUpdateCollectionFormDataSchemaDef } from '../../CollectionsListPage.types';

import { useEditingCollectionsRowIds } from '../../hooks/use-editing-collections-row-ids';
import { CollectionsListActionsCell } from './components/column-cells/CollectionsListActionsCell';
import { CollectionsListCustomFieldCell } from './components/column-cells/CollectionsListCustomFieldCell/CollectionsListCustomFieldCell';
import { CollectionsListNameCell } from './components/column-cells/CollectionsListNameCell/CollectionsListNameCell';
import { CollectionsListNameField } from './components/column-cells/CollectionsListNameCell/components/CollectionsListNameField/CollectionsListNameField';
import { CollectionsListNotesCell } from './components/column-cells/CollectionsListNotesCell/CollectionsListNotesCell';

const columnHelper =
  createColumnHelper<
    GetPaginatedCollectionsResponseDef['collections'][number]
  >();

const CustomFieldCell = <TNum extends 1 | 2 | 3>(props: {
  customFieldNum: TNum;
  getValue: Getter<string | null>;
  row: Row<GetPaginatedCollectionsResponseDef['collections'][number]>;
}) => {
  const { customFieldNum, getValue, row } = props;

  const isEnabled = row.original[`customField${customFieldNum}Enabled`];

  return isEnabled ? (
    <p className="flex align-items-center">{getValue()}</p>
  ) : (
    <p>-</p>
  );
};

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
  onEditClick: (rowId?: string) => void;
};

export const getCollectionsListTableColumns = (
  props: GetCollectionsListTableColumnsPropsDef,
) => {
  const { form, onCancel, onEditClick } = props;

  return [
    columnHelper.accessor('name', {
      cell: (props) => {
        const { getValue, row } = props;

        const { getIsEditingRowId } = useEditingCollectionsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

        return (
          <CollectionsListNameCell {...props}>
            {isEditingRow ? (
              <CollectionsListNameField form={form} index={row.index} />
            ) : (
              <p>{getValue()}</p>
            )}
          </CollectionsListNameCell>
        );
      },
      header: ({ table }) => {
        const { resetLastSelectedRowId } = useLastSelectedTableRowsStore();

        const title = 'Name';
        const { isEditing } = useEditingCollectionsRowIds();

        return table.getRowCount() ? (
          <div className="flex items-center gap-2">
            <CheckboxField
              checked={table.getIsAllRowsSelected()}
              disabled={isEditing}
              indeterminate={table.getIsSomeRowsSelected()}
              onCheckedChange={(_checked, { event }) => {
                const toggleAllRowsSelectedHandler =
                  table.getToggleAllRowsSelectedHandler();

                resetLastSelectedRowId();
                toggleAllRowsSelectedHandler(event);
              }}
            />
            <span>{title}</span>
          </div>
        ) : (
          title
        );
      },
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
