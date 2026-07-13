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
    editIsDisabled,
    editLabel = 'Edit',
    editOnClick,
    isEditing,
    onCancelEdit,
    row,
  } = props;

  const [showConfirmDelete, hideConfirmDelete] = useDialog(() => {
    const recordName = row.original.name;

    const { onInterceptProcessingRequest, processing } = useSpinner();

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
                  onInterceptProcessingRequest(async () => {
                    await deleteOnClick(row.original);
                    hideConfirmDelete();
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
