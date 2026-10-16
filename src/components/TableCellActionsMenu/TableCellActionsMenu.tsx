import { MoreMenu } from '#/components/MoreMenu';

import type { TableCellActionsMenuPropsDef } from './types';

import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog';
import { useDialog } from '../Dialog/hooks/useDialog';

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

    return (
      <ConfirmDeleteDialog
        hideDialog={hideConfirmDeleteDialog}
        onConfirm={async () => {
          deleteOnClick(rowData);
        }}
      >
        <p className="text-center">
          Are you sure you want to delete{' '}
          {recordName ? `"${recordName}"` : 'this item'}?
        </p>
      </ConfirmDeleteDialog>
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
                Label: `Cancel ${editLabel}`,
                onClick: async () => {
                  onCancelEdit?.(rowData);
                },
              }
            : {
                disabled: editIsDisabled,
                Label: editLabel,
                onClick: async () => {
                  await editOnClick(rowData);
                },
              },
          {
            disabled: deleteIsDisabled,
            Label: deleteLabel,
            onClick: showConfirmDeleteDialog,
          },
        ]}
      />
    </div>
  );
};
