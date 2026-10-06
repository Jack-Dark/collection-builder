import { useSelector } from '@tanstack/react-store';

import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { TableCellActionsMenu } from '#/components/TableCellActionsMenu';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { CollectionDetailsActionsCellPropsDef } from './CollectionDetailsActionsCell.types';

export const CollectionDetailsActionsCell = (
  props: CollectionDetailsActionsCellPropsDef,
) => {
  const { form, onCancel, onEditClick, row } = props;

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

  const collectionItem = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[row.index];
  });

  const { getHasNewRecord, getIsEditingRowId, isEditing } =
    useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(row.id);

  const isCreatingRecord = getHasNewRecord();

  return (
    <TableCellActionsMenu
      deleteIsDisabled={isEditing || isDeletePending}
      deleteOnClick={async () => {
        if (typeof collectionItem.id === 'number') {
          await onDeleteCollectionItemsByIds({
            collectionItemIds: [collectionItem.id],
          });
        }
      }}
      editIsDisabled={isCreatingRecord || isDeletePending}
      editOnClick={({ id }) => {
        onEditClick(String(id));
      }}
      isEditing={isEditingRow}
      onCancelEdit={onCancel}
      rowData={collectionItem}
    />
  );
};
