import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo } from 'react';

import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Button } from '#/components/Button';
import { useSelectedTableRowsStore } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../../../../../CollectionsListPage/hooks/use-editing-collections-row-ids';
import {
  addCollectionItemFormDefaultValues,
  withCollectionDetailsForm,
} from '../../../../CollectionDetailsPage.form';
import {
  AddNewCollectionItemButton,
  CollectionDetailsSubmitButton,
} from '../CreateOrUpdateCollectionItemForm';

export const CollectionDetailsTableActions = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: {
    onCancel: () => {},
  },
  render: ({ form, onCancel }) => {
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);

    const { addToEditingRowIds, isEditing } = useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, selectedTableRows } =
      useSelectedTableRowsStore();

    const selectedRowIds = useMemo(() => {
      return getSelectedRowIds();
    }, [selectedTableRows]);

    const invalidateGetCollectionDetailsById =
      useInvalidateGetCollectionDetailsById();

    const { isPending: isDeletePending, onDeleteCollectionItemsByIds } =
      useDeleteCollectionItemsByIds({
        onSuccess: async () => {
          await invalidateGetCollectionDetailsById({
            id: collectionId,
          });
        },
      });

    return (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <div className="flex justify-between">
              <div className="flex gap-2">
                {!!selectedRowIds.length && (
                  <>
                    <Button
                      disabled={isEditing}
                      Icon={EditIcon}
                      onClick={() => {
                        addToEditingRowIds(...selectedRowIds);

                        const selectedRowsInEditMode =
                          collectionItemsField.state.value.map((rowRecord) => {
                            const isEditing = selectedRowIds.includes(
                              String(rowRecord.id),
                            );

                            return { ...rowRecord, isEditing };
                          });

                        collectionItemsField.setValue(selectedRowsInEditMode);
                      }}
                      text="Edit"
                      variant="secondary"
                    />

                    <Button
                      disabled={isEditing}
                      Icon={DeleteIcon}
                      onClick={async () => {
                        await onDeleteCollectionItemsByIds({
                          collectionItemIds: selectedRowIds.map((id) => {
                            return Number(id);
                          }),
                        });
                      }}
                      processing={isDeletePending}
                      text="Delete"
                      variant="alert"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={onCancel}
                      text="Cancel"
                      variant="mono"
                    />
                    <CollectionDetailsSubmitButton form={form} />
                  </>
                ) : (
                  <AddNewCollectionItemButton
                    disabled={false}
                    form={form}
                    insertAtIndex={0}
                    text="Add New"
                  />
                )}
              </div>
            </div>
          );
        }}
      </form.AppField>
    );
  },
});
