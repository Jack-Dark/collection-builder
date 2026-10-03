import { MoreMenu } from '#/components/MoreMenu';

import type { TableCellActionsMenuPropsDef } from './types';

import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { useDialog } from '../Dialog/hooks/useDialog';
import { useSpinner } from '../FullPageLoadingSpinner/useSpinner';

export const TableCellActionsMenu = <
  TData extends { id: number | string; name: string },
>(
  props: TableCellActionsMenuPropsDef<TData>,
) => {
  const {
    deleteIsDisabled,
    deleteLabel = 'Delete',
    deleteOnClick,
    disabled,
    editIsDisabled,
    editLabel = 'Edit',
    editOnClick,
    isEditing,
    onCancelEdit,
    rowData,
  } = props;

  const [showConfirmDeleteDialog, hideConfirmDeleteDialog] = useDialog(() => {
    const recordName = rowData.name;

    const { onInterceptProcessingRequest, processing } = useSpinner();

    return (
      <Dialog
        Footer={() => {
          return (
            <>
              <Button
                onClick={hideConfirmDeleteDialog}
                text="Cancel"
                variant="mono"
              />
              <Button
                onClick={async () => {
                  onInterceptProcessingRequest(async () => {
                    await deleteOnClick(rowData);
                    hideConfirmDeleteDialog();
                  });
                }}
                processing={processing}
                text="Delete"
                variant="alert"
              />
            </>
          );
        }}
        Header="Confirm Delete"
      >
        <p className="text-center">
          Are you sure you want to delete{' '}
          {recordName ? `"${recordName}"` : 'this item'}? This action cannot be
          undone.
        </p>
      </Dialog>
    );
  }, []);

  return (
    <div className="flex flex-nowrap gap-2 justify-end items-center w-full">
      <MoreMenu
        disabled={disabled}
        items={[
          isEditing
            ? {
                disabled: editIsDisabled,
                label: `Cancel ${editLabel}`,
                onClick: async () => {
                  onCancelEdit?.(rowData);
                },
              }
            : {
                disabled: editIsDisabled,
                label: editLabel,
                onClick: async () => {
                  await editOnClick(rowData);
                },
              },
          {
            disabled: deleteIsDisabled,
            label: deleteLabel,
            onClick: showConfirmDeleteDialog,
          },
        ]}
      />
    </div>
  );
};
