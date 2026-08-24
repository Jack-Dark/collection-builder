import { useDeleteCollectionById } from '#/api/routes/collections/delete-collection-by-id/delete-collection-by-id.react-query';
import { useInvalidateGetPaginatedCollections } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { TableCellActionsMenu } from '#/components/TableCellActionsMenu';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import type { CollectionsListActionsCellPropsDef } from './CollectionsListActionsCell.types';

export const CollectionsListActionsCell = (
  props: CollectionsListActionsCellPropsDef,
) => {
  const { onCancel, onEditClick, rowData, rowId } = props;

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const { isPending: isDeletePending, onDeleteCollectionById } =
    useDeleteCollectionById({
      onSuccess: async () => {
        await invalidateGetPaginatedCollections({
          id: collectionId,
        });
      },
    });

  const collectionId = rowData.id;

  const { getHasNewRecord, getIsEditingRowId, isEditing } =
    useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const hasNewRecord = getHasNewRecord();

  return (
    <TableCellActionsMenu
      deleteIsDisabled={hasNewRecord || isEditing || isDeletePending}
      deleteOnClick={async () => {
        if (typeof collectionId === 'number') {
          await onDeleteCollectionById({
            ids: [collectionId],
          });
        }
      }}
      disabled={hasNewRecord}
      editIsDisabled={hasNewRecord || isDeletePending}
      editOnClick={({ id }) => {
        onEditClick(String(id));
      }}
      isEditing={isEditingRow}
      onCancelEdit={onCancel}
      rowData={rowData}
    />
  );
};
