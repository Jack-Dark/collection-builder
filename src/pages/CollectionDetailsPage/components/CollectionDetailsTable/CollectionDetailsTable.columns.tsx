import type { AppFieldExtendedReactFormApi } from '@tanstack/react-form';
import type {
  AccessorKeyColumnDefBase,
  CellContext,
} from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import { useKeyHold } from '@tanstack/react-hotkeys';
import { createColumnHelper } from '@tanstack/react-table';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import {
  getRowRange,
  useLastSelectedTableRowsStore,
  useSelectedTableRowsStore,
} from '#/components/Table';
import { ZoomableThumbnail } from '#/components/ZoomableThumbnail';

import type { CreateOrUpdateCollectionItemFormDataDef } from '../../CollectionDetailsPage.types';

import { useEditingCollectionItemsRowIds } from '../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { useTableCustomFieldsStore } from '../../hooks/use-table-custom-fields-store';
import { CollectionDetailsActionsCell } from './CollectionDetailsActionsCell';
import { CollectionDetailsNameField } from './CollectionDetailsNameCell/components/CollectionDetailsNameField';
import { CollectionDetailsCustomFieldCell } from './components/CollectionDetailsCustomFieldCell';
import { CollectionDetailsEditionCell } from './components/CollectionDetailsEditionCell';
import { CollectionDetailsImagesField } from './components/CollectionDetailsImagesField';
import { CollectionDetailsNotesCell } from './components/CollectionDetailsNotesCell';
import { CollectionDetailsCreatedAtCell } from './components/CreateOrUpdateCollectionItemForm';

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

export const CollectionDetailsNameCell = (
  props: PropsWithChildren<CellContext<CollectionItemRecordDef, string>>,
) => {
  const { children, row, table } = props;
  const isShiftHeld = useKeyHold('Shift');

  const { lastSelectedRowId, setLastSelectedRowId } =
    useLastSelectedTableRowsStore();

  const { setSelectedTableRows } = useSelectedTableRowsStore();

  const { isEditing } = useEditingCollectionItemsRowIds();

  return (
    <div className="flex items-center gap-2">
      <CheckboxField
        checked={row.getIsSelected()}
        disabled={isEditing || !row.getCanSelect()}
        onCheckedChange={(checked) => {
          const { rows } = table.getRowModel();
          const rowId = row.id;

          if (isShiftHeld && lastSelectedRowId) {
            const currentIndex = row.index;
            const prevIndex = rows.findIndex(({ id }) => {
              return id === lastSelectedRowId;
            });

            const rowsToToggle = getRowRange({
              currentIndex,
              prevIndex,
              rows,
            });

            rowsToToggle.forEach((row) => {
              row.toggleSelected(checked);
            });
          } else {
            row.toggleSelected();
          }

          table.setRowSelection((prevSelectedRows) => {
            const selectedRows = {
              ...prevSelectedRows,
            };
            if (checked) {
              selectedRows[rowId] = true;
            } else {
              delete selectedRows[rowId];
            }

            setSelectedTableRows(selectedRows);

            return selectedRows;
          });
          setLastSelectedRowId(rowId);

          // ? clears any text highlighting
          document.getSelection()?.removeAllRanges();
        }}
      />
      {children}
    </div>
  );
};
