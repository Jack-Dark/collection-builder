import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo } from 'react';

import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useDeleteCollectionById } from '#/api/routes/collections/delete-collection-by-id/delete-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { useSelectedTableRowsStore } from '#/components/Table';
import {
  collectionsListFormDefaultValues,
  withCollectionsListForm,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import { AddNewCollectionButton } from './components/AddNewCollectionButton';
import { CollectionsListSubmitButton } from './components/CollectionsListSubmitButton';

export const CollectionsListTableRowActions = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  props: {
    onCancel: () => {},
  },
  render: ({ form, onCancel }) => {
    const { addToEditingRowIds, isEditing } = useEditingCollectionsRowIds();

    const { getSelectedRowIds, selectedTableRows } =
      useSelectedTableRowsStore();

    const selectedRowIds = useMemo(() => {
      return getSelectedRowIds();
    }, [selectedTableRows]);

    const invalidateGetCollectionDetailsById =
      useInvalidateGetCollectionDetailsById();

    const { isPending: isDeletePending, onDeleteCollectionById } =
      useDeleteCollectionById({
        onSuccess: async (_response, { ids }) => {
          await Promise.all(
            ids.map(async (id) => {
              await invalidateGetCollectionDetailsById({
                id,
              });
            }),
          );
        },
      });

    return (
      <form.AppField mode="array" name="records">
        {(recordsField) => {
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
                          recordsField.state.value.map((rowRecord) => {
                            const isEditing = selectedRowIds.includes(
                              String(rowRecord.id),
                            );

                            return { ...rowRecord, isEditing };
                          });

                        recordsField.setValue(selectedRowsInEditMode);
                      }}
                      text="Edit"
                      variant="secondary"
                    />

                    <Button
                      disabled={isEditing}
                      Icon={DeleteIcon}
                      onClick={async () => {
                        await onDeleteCollectionById({
                          ids: selectedRowIds.map((id) => {
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
                    <CollectionsListSubmitButton form={form} />
                  </>
                ) : (
                  <AddNewCollectionButton
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
