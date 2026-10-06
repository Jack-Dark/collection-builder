import { createColumnHelper } from '@tanstack/react-table';
import { sortBy } from 'lodash';

import type { TTableFeatures } from '#/components/Table';

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

const columnHelper = createColumnHelper<
  TTableFeatures,
  CreateOrUpdateCollectionItemFormRowDataDef
>();

export const getCollectionItemsTableColumns = (
  props: GetCollectionItemsTableColumnsPropsDef,
) => {
  const { customFields, form, onCancel, onEditClick } = props;

  return [
    columnHelper.accessor('name', {
      cell: (props) => {
        const { row } = props;

        return (
          <CollectionDetailsNameCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Name',
      size: 250,
    }),
    columnHelper.accessor('images', {
      cell: (cellContext) => {
        const { row } = cellContext;

        return (
          <CollectionDetailsImagesCell {...cellContext} form={form}>
            <CollectionDetailsImagesField form={form} index={row.index} />
          </CollectionDetailsImagesCell>
        );
      },
      header: 'Images',
      minSize: 200,
    }),
    ...sortBy(customFields, (item) => {
      return item.details.order;
    }).map((customField) => {
      return columnHelper.accessor('customFieldValues', {
        cell: ({ row }) => {
          return (
            <CollectionDetailsCustomFieldCell
              customField={customField}
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
      cell: ({ row }) => {
        return (
          <CollectionDetailsEditionCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Edition',
      minSize: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsNotesCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Notes',
      minSize: 210,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsCreatedAtCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Added',
      size: 200,
    }),
    columnHelper.accessor('id', {
      cell: (cellContext) => {
        return (
          <CollectionDetailsActionsCell
            {...cellContext}
            form={form}
            onCancel={onCancel}
            onEditClick={onEditClick}
          />
        );
      },
      header: '',
      id: 'actions',
      size: 40,
    }),
  ];
};
