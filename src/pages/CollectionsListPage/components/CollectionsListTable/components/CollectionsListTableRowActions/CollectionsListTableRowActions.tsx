import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useLayoutEffect } from 'react';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useDeleteCollectionById } from '#/api/routes/collections/delete-collection-by-id/delete-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { Popover } from '#/components/Popover';
import { pluralize } from '#/helpers/pluralize';
import { useUserContext } from '#/hooks/use-user-context';
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

  const user = useUserContext();

  const { notifyWarning } = useNotifications();

  const { addToEditingRowIds, isEditing } = useEditingCollectionsRowIds();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onDeleteCollectionById } = useDeleteCollectionById({
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

  const [showConfirmDeleteDialog, hideConfirmDeleteDialog] = useDialog(() => {
    const numSelectedRows = selectedRowIds.length;

    const onConfirm = async () => {
      await onDeleteCollectionById({
        ids: selectedRowIds.map((id) => {
          return Number(id);
        }),
      });
    };

    return (
      <ConfirmDeleteDialog
        hideDialog={hideConfirmDeleteDialog}
        onConfirm={onConfirm}
      >
        <p className="text-center">
          Are you sure you want to delete{' '}
          {selectedRowIds.length > 1
            ? `${numSelectedRows} ${pluralize('collection', numSelectedRows)}`
            : 'this collection'}
          ?
        </p>
      </ConfirmDeleteDialog>
    );
  }, [selectedRowIds]);

  const verifyEmailMessage =
    'You must verify your email address before you can create new collections. It may be in your spam folder.';

  useLayoutEffect(() => {
    if (user?.id && !user?.emailVerified) {
      notifyWarning(`Welcome! ${verifyEmailMessage}`, {
        // TODO - BUG: EFFECT RENDERING MULTIPLE TIMES ON FIRST PAGE LOAD
        closeOthersOfType: true,
        keepOpen: true,
      });
    }
  }, [user?.emailVerified]);

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
                    }}
                    text="Edit"
                    variant="secondary"
                  />

                  <Button
                    disabled={isEditing}
                    Icon={DeleteIcon}
                    onClick={showConfirmDeleteDialog}
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
                <Popover
                  Description={verifyEmailMessage}
                  isTriggerButton
                  Trigger={() => {
                    return (
                      <AddNewCollectionButton
                        disabled={!user?.emailVerified}
                        form={form}
                        insertAtIndex={0}
                        text="Add New"
                      />
                    );
                  }}
                />
              )}
            </div>
          </div>
        );
      }}
    </form.ArrayField>
  );
};
