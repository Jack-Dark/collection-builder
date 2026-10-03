import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from '@tanstack/react-form';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useDeleteCollectionById } from '#/api/routes/collections/delete-collection-by-id/delete-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import { AddNewCollectionButton } from './components/AddNewCollectionButton';
import { CollectionsListSubmitButton } from './components/CollectionsListSubmitButton';

export const CollectionsListTableRowActions = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onCancel: () => void;
  resetRowSelection: () => void;
  /** Array of the `string` versions of the row data's `id` values. */
  selectedRowIds: string[];
}) => {
  const { form, onCancel, resetRowSelection, selectedRowIds } = props;

  const { addToEditingRowIds, isEditing } = useEditingCollectionsRowIds();

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
        resetRowSelection();
      },
    });

  const rowsMarkedAsEditing = useSelector(form.atom, ({ values }) => {
    return values.records.map((record) => {
      const isEditing = selectedRowIds.includes(String(record.id));

      return { ...record, isEditing };
    });
  });

  return (
    <form.ArrayField name="records">
      {() => {
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

                      form.setFieldValue('records', rowsMarkedAsEditing);
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
                  <CollectionsListSubmitButton
                    form={form}
                    resetRowSelection={resetRowSelection}
                  />
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
    </form.ArrayField>
  );
};
