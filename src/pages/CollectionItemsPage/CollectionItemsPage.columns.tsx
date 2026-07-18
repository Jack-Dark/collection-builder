import type {
  AccessorKeyColumnDefBase,
  CellContext,
} from '@tanstack/react-table';

import { useKeyHold } from '@tanstack/react-hotkeys';
import { createColumnHelper } from '@tanstack/react-table';
import formatDate, { masks } from 'dateformat';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import {
  getRowRange,
  useLastSelectedTableRowsStore,
  useSelectedTableRowsStore,
} from '#/components/Table';
import { ZoomableThumbnail } from '#/components/ZoomableThumbnail';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { TableCellActionsMenu } from '../../components/TableCellActionsMenu';
import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import {
  CreateOrUpdateCollectionItemFormCustomField,
  CreateOrUpdateCollectionItemFormEditionFields,
  CreateOrUpdateCollectionItemFormImagesField,
  CreateOrUpdateCollectionItemFormNameField,
  CreateOrUpdateCollectionItemFormNotesField,
  CreateOrUpdateCollectionItemFormActions,
} from './components/CreateOrUpdateCollectionItemForm';
import { useCustomFieldsStore } from './hooks/use-custom-fields-store';

const columnHelper = createColumnHelper<CollectionItemRecordDef>();

export const getCollectionItemsTableColumns = (
  props: Pick<
    CollectionRecordDef,
    | 'customField1Enabled'
    | 'customField1Label'
    | 'customField2Enabled'
    | 'customField2Label'
    | 'customField3Enabled'
    | 'customField3Label'
  > & {
    form: any;
    onCancel: () => void;
  },
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
  } = props;

  return [
    columnHelper.accessor('name', {
      cell: ({ getValue, row, table }) => {
        const isShiftHeld = useKeyHold('Shift');

        const { lastSelectedRowId, setLastSelectedRowId } =
          useLastSelectedTableRowsStore();

        const { setSelectedTableRows } = useSelectedTableRowsStore();

        const { getIsEditingRowId, isEditing } =
          useEditingCollectionItemsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

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
            {isEditingRow ? (
              <CreateOrUpdateCollectionItemFormNameField
                form={form}
                index={row.index}
              />
            ) : (
              <p>{getValue()}</p>
            )}
          </div>
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
              <CreateOrUpdateCollectionItemFormImagesField
                form={form}
                index={row.index}
              />
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
          const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
          const isEditingRow = getIsEditingRowId(row.id);

          const { addToCustomField1Values, customFields } =
            useCustomFieldsStore();

          return isEditingRow ? (
            <CreateOrUpdateCollectionItemFormCustomField
              addToCustomFieldValues={addToCustomField1Values}
              fieldName="customField1Value"
              fieldValues={customFields.customField1Values}
              form={form}
              index={row.index}
              label={customField1Label || ''}
            />
          ) : (
            <p>{getValue()}</p>
          );
        },
        header: customField1Label || '',
        minSize: 200,
      }),
    customField2Enabled &&
      columnHelper.accessor('customField2Value', {
        cell: ({ getValue, row }) => {
          const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
          const isEditingRow = getIsEditingRowId(row.id);

          const { addToCustomField2Values, customFields } =
            useCustomFieldsStore();

          return isEditingRow ? (
            <CreateOrUpdateCollectionItemFormCustomField
              addToCustomFieldValues={addToCustomField2Values}
              fieldName="customField2Value"
              fieldValues={customFields.customField2Values}
              form={form}
              index={row.index}
              label={customField2Label || ''}
            />
          ) : (
            <p>{getValue()}</p>
          );
        },
        header: customField2Label || '',
        minSize: 200,
      }),
    customField3Enabled &&
      columnHelper.accessor('customField3Value', {
        cell: ({ getValue, row }) => {
          const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
          const isEditingRow = getIsEditingRowId(row.id);

          const { addToCustomField3Values, customFields } =
            useCustomFieldsStore();

          return isEditingRow ? (
            <CreateOrUpdateCollectionItemFormCustomField
              addToCustomFieldValues={addToCustomField3Values}
              fieldName="customField3Value"
              fieldValues={customFields.customField3Values}
              form={form}
              index={row.index}
              label={customField3Label || ''}
            />
          ) : (
            <p>{getValue()}</p>
          );
        },
        header: customField3Label || '',
        minSize: 200,
      }),
    columnHelper.accessor('editionDetails', {
      cell: ({ getValue, row }) => {
        const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

        return isEditingRow ? (
          <CreateOrUpdateCollectionItemFormEditionFields
            form={form}
            index={row.index}
          />
        ) : (
          <p>{getValue() || '-'}</p>
        );
      },
      header: 'Edition',
      minSize: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ getValue, row }) => {
        const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

        return isEditingRow ? (
          <CreateOrUpdateCollectionItemFormNotesField
            form={form}
            index={row.index}
          />
        ) : (
          <p>{getValue() || '-'}</p>
        );
      },
      header: 'Notes',
      minSize: 210,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ getValue, row }) => {
        const { getHasNewRecord, getIsEditingRowId } =
          useEditingCollectionItemsRowIds();
        const isEditingRow = getIsEditingRowId(row.id);

        const date = getValue();

        return isEditingRow && getHasNewRecord() ? (
          <CreateOrUpdateCollectionItemFormActions
            form={form}
            index={row.index}
          />
        ) : date ? (
          <p>{formatDate(date, masks.paddedShortDate)}</p>
        ) : null;
      },
      header: 'Added',
      size: 200,
    }),
    columnHelper.accessor('id', {
      cell: (context) => {
        return (
          <CollectionDetailsActionsCell onCancel={onCancel} {...context} />
        );
      },
      header: '',
      id: 'actions',
      size: 40,
    }),
  ].filter(Boolean) as AccessorKeyColumnDefBase<CollectionItemRecordDef>[];
};

const CollectionDetailsActionsCell = ({
  getValue,
  onCancel,
  row,
}: CellContext<CollectionItemRecordDef, number> & {
  onCancel: () => void;
}) => {
  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);

  const { isPending: isDeletePending, onDeleteCollectionItemsByIds } =
    useDeleteCollectionItemsByIds({
      onSuccess: async () => {
        await invalidateGetCollectionDetailsById({
          id: collectionId,
        });
      },
    });

  const collectionItemId = getValue();

  const { getHasNewRecord, getIsEditingRowId, isEditing, setEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(row.id);

  const isCreatingRecord = getHasNewRecord();

  return (
    <TableCellActionsMenu
      deleteIsDisabled={isEditing || isDeletePending}
      deleteOnClick={async () => {
        await onDeleteCollectionItemsByIds({
          collectionItemIds: [collectionItemId],
        });
      }}
      editIsDisabled={isCreatingRecord || isDeletePending}
      editOnClick={async () => {
        setEditingRowIds((prevRowIds) => {
          return [...prevRowIds, row.id];
        });
      }}
      isEditing={isEditingRow}
      onCancelEdit={onCancel}
      row={row}
    />
  );
};
