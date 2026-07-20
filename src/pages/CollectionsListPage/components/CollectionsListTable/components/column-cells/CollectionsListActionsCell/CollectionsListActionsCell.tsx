import { useDeleteCollectionById } from '#/api/routes/collections/delete-collection-by-id/delete-collection-by-id.react-query';
import { useInvalidateGetPaginatedCollections } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { TableCellActionsMenu } from '#/components/TableCellActionsMenu';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import type { CollectionsListActionsCellPropsDef } from './CollectionsListActionsCell.types';

export const CollectionsListActionsCell = (
  props: CollectionsListActionsCellPropsDef,
) => {
  const { getValue, onCancel, onEditClick, row } = props;

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

  const collectionId = getValue();

  const { getHasNewRecord, getIsEditingRowId, isEditing } =
    useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(row.id);

  const isCreatingRecord = getHasNewRecord();

  return (
    <TableCellActionsMenu
      deleteIsDisabled={isEditing || isDeletePending}
      deleteOnClick={async () => {
        await onDeleteCollectionById({
          ids: [collectionId],
        });
      }}
      editIsDisabled={isCreatingRecord || isDeletePending}
      editOnClick={({ id }) => {
        onEditClick(String(id));
      }}
      isEditing={isEditingRow}
      onCancelEdit={onCancel}
      row={row}
    />
  );
};
