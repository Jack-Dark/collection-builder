import { MoreMenu } from '#/components/MoreMenu';

import type { TableCellActionsMenuPropsDef } from './types';

import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { useDialog } from '../Dialog/hooks/useDialog';

export const TableCellActionsMenu = <TData extends { id: number | string }>(
  props: TableCellActionsMenuPropsDef<TData>,
) => {
  const {
    deleteIsDisabled,
    deleteLabel = 'Delete',
    deleteOnClick,
    editIsDisabled,
    editLabel = 'Edit',
    editOnClick,
    isEditing,
    onCancelEdit,
    row,
  } = props;

  const [showConfirmDelete, hideConfirmDelete] = useDialog(() => {
    // @ts-expect-error
    const recordName: string = row.original?.name;

    return (
      <Dialog
        Footer={() => {
          return (
            <>
              <Button
                onClick={hideConfirmDelete}
                text="Cancel"
                variant="mono"
              />
              <Button
                onClick={async () => {
                  await deleteOnClick(row.original);
                }}
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
    <div className="flex flex-nowrap gap-2 justify-end items-center">
      <MoreMenu
        items={[
          isEditing
            ? {
                disabled: editIsDisabled,
                label: `Cancel ${editLabel}`,
                onClick: async () => {
                  onCancelEdit?.(row.original);
                },
              }
            : {
                disabled: editIsDisabled,
                label: editLabel,
                onClick: async () => {
                  await editOnClick(row.original);
                },
              },
          {
            disabled: deleteIsDisabled,
            label: deleteLabel,
            onClick: showConfirmDelete,
          },
        ]}
      />
    </div>
  );
};
