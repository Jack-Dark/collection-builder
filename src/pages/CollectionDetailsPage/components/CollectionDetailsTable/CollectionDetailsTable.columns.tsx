import type { AppFieldExtendedReactFormApi } from '@tanstack/react-form';
import type { AccessorKeyColumnDefBase } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { useLastSelectedTableRowsStore } from '#/components/Table';
import { ZoomableThumbnail } from '#/components/ZoomableThumbnail';

import type { CreateOrUpdateCollectionItemFormDataDef } from '../../CollectionDetailsPage.types';

import { useEditingCollectionItemsRowIds } from '../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { useTableCustomFieldsStore } from '../../hooks/use-table-custom-fields-store';
import { CollectionDetailsActionsCell } from './components/column-cells/CollectionDetailsActionsCell';
import { CollectionDetailsCreatedAtCell } from './components/column-cells/CollectionDetailsCreatedAtCell';
import { CollectionDetailsCustomFieldCell } from './components/column-cells/CollectionDetailsCustomFieldCell';
import { CollectionDetailsEditionCell } from './components/column-cells/CollectionDetailsEditionCell';
import { CollectionDetailsImagesField } from './components/column-cells/CollectionDetailsImagesField';
import { CollectionDetailsNameCell } from './components/column-cells/CollectionDetailsNameCell';
import { CollectionDetailsNameField } from './components/column-cells/CollectionDetailsNameCell/components/CollectionDetailsNameField';
import { CollectionDetailsNotesCell } from './components/column-cells/CollectionDetailsNotesCell';

const columnHelper = createColumnHelper<CollectionItemRecordDef>();

type GetCollectionItemsTableColumns = Pick<
  CollectionRecordDef,
  | 'customField1Enabled'
  | 'customField1Label'
  | 'customField2Enabled'
  | 'customField2Label'
  | 'customField3Enabled'
  | 'customField3Label'
> & {
  form: AppFieldExtendedReactFormApi<
    CreateOrUpdateCollectionItemFormDataDef,
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

export const getCollectionItemsTableColumns = (
  props: GetCollectionItemsTableColumns,
) => {
  const {
    customField1Enabled,
    customField1Label,
    customField2Enabled,
    customField2Label,
    customField3Enabled,
    customField3Label,
    form,
    onCancel,
    onEditClick,
  } = props;

  return [
    columnHelper.accessor('name', {
      cell: (props) => {
        const { getValue, row } = props;

        const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

        return (
          <CollectionDetailsNameCell {...props}>
            {isEditingRow ? (
              <CollectionDetailsNameField form={form} index={row.index} />
            ) : (
              <p>{getValue()}</p>
            )}
          </CollectionDetailsNameCell>
        );
      },
      header: ({ table }) => {
        const { resetLastSelectedRowId } = useLastSelectedTableRowsStore();

        const title = 'Name';
        const { isEditing } = useEditingCollectionItemsRowIds();

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
    columnHelper.accessor('images', {
      cell: ({ getValue, row }) => {
        const images = getValue();

        const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

        return (
          <div className="flex flex-wrap gap-1 items-center">
            {isEditingRow ? (
              <CollectionDetailsImagesField form={form} index={row.index} />
            ) : images.length ? (
              <>
                {images.map((publicId, index) => {
                  return (
                    <div
                      className="p-1 size-14 bg-white border border-gray-400 text-gray-500"
                      key={publicId}
                    >
                      <ZoomableThumbnail
                        alt={`${row.original.name} image ${index + 1}`}
                        image={{
                          publicId,
                        }}
                        thumbnail={{
                          height: thumbnailSize,
                          publicId,
                          width: thumbnailSize,
                        }}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <p>-</p>
            )}
          </div>
        );
      },
      header: 'Images',
      minSize: 200,
    }),
    customField1Enabled &&
      columnHelper.accessor('customField1Value', {
        cell: ({ getValue, row }) => {
          const { addToCustomField1Values, customFields } =
            useTableCustomFieldsStore();

          return (
            <CollectionDetailsCustomFieldCell
              addToCustomFieldValues={addToCustomField1Values}
              fieldName="customField1Value"
              fieldValues={customFields.customField1Values}
              form={form}
              index={row.index}
              label={customField1Label || ''}
              rowId={row.id}
              value={getValue()}
            />
          );
        },
        header: customField1Label || '',
        minSize: 200,
      }),
    customField2Enabled &&
      columnHelper.accessor('customField2Value', {
        cell: ({ getValue, row }) => {
          const { addToCustomField2Values, customFields } =
            useTableCustomFieldsStore();

          return (
            <CollectionDetailsCustomFieldCell
              addToCustomFieldValues={addToCustomField2Values}
              fieldName="customField2Value"
              fieldValues={customFields.customField2Values}
              form={form}
              index={row.index}
              label={customField2Label || ''}
              rowId={row.id}
              value={getValue()}
            />
          );
        },
        header: customField2Label || '',
        minSize: 200,
      }),
    customField3Enabled &&
      columnHelper.accessor('customField3Value', {
        cell: ({ getValue, row }) => {
          const { addToCustomField3Values, customFields } =
            useTableCustomFieldsStore();

          return (
            <CollectionDetailsCustomFieldCell
              addToCustomFieldValues={addToCustomField3Values}
              fieldName="customField3Value"
              fieldValues={customFields.customField3Values}
              form={form}
              index={row.index}
              label={customField3Label || ''}
              rowId={row.id}
              value={getValue()}
            />
          );
        },
        header: customField3Label || '',
        minSize: 200,
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
  ].filter(Boolean) as AccessorKeyColumnDefBase<CollectionItemRecordDef>[];
};
