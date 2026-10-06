import { createColumnHelper } from '@tanstack/react-table';

import type { CreateOrUpdateCollectionItemFormRowDataDef } from '../../CollectionDetailsPage.types';
import type { GetCollectionItemsTableColumnsPropsDef } from './CollectionDetailsTable.types';

import { CollectionDetailsActionsCell } from './components/column-cells/CollectionDetailsActionsCell';
import { CollectionDetailsCreatedAtCell } from './components/column-cells/CollectionDetailsCreatedAtCell';
import { CollectionDetailsCustomFieldCell } from './components/column-cells/CollectionDetailsCustomFieldCell';
import { CollectionDetailsEditionCell } from './components/column-cells/CollectionDetailsEditionCell';
import { CollectionDetailsImagesCell } from './components/column-cells/CollectionDetailsImagesCell';
import { CollectionDetailsImagesField } from './components/column-cells/CollectionDetailsImagesCell/components/CollectionDetailsImagesField';
import { CollectionDetailsNameCell } from './components/column-cells/CollectionDetailsNameCell';
import { CollectionDetailsNotesCell } from './components/column-cells/CollectionDetailsNotesCell';

const columnHelper =
  createColumnHelper<CreateOrUpdateCollectionItemFormRowDataDef>();

export const useGetCollectionItemsTableColumns = (
  props: GetCollectionItemsTableColumnsPropsDef,
) => {
  const { customFields, form, onCancel, onEditClick } = props;

  return [
    columnHelper.accessor('name', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionDetailsNameCell
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
    columnHelper.accessor('images', {
      cell: (props) => {
        const { row } = props;

        return (
          <CollectionDetailsImagesCell {...props}>
            <CollectionDetailsImagesField form={form} index={row.index} />
          </CollectionDetailsImagesCell>
        );
      },
      header: 'Images',
      minSize: 200,
    }),
    ...customFields.map((customField) => {
      return columnHelper.accessor('customFieldValues', {
        cell: ({ getValue, row }) => {
          const customFieldId = customField.id;

          return (
            <CollectionDetailsCustomFieldCell
              collectionItemId={row.original.id}
              customField={customField}
              customFieldValue={getValue()?.[customFieldId]}
              form={form}
              rowId={row.id}
              rowIndex={row.index}
            />
          );
        },
        header: customField.name,
        id: String(customField.id),
        minSize: 200,
      });
    }),
    columnHelper.accessor('editionDetails', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionDetailsEditionCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Edition',
      minSize: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionDetailsNotesCell
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
    columnHelper.accessor('createdAt', {
      cell: ({ getValue, row }) => {
        return (
          <CollectionDetailsCreatedAtCell
            form={form}
            index={row.index}
            rowId={row.id}
            value={getValue()}
          />
        );
      },
      header: 'Added',
      size: 200,
    }),
    columnHelper.accessor('id', {
      cell: (context) => {
        return (
          <CollectionDetailsActionsCell
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
