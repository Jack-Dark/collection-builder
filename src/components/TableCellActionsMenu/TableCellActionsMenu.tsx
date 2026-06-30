import { MoreMenu } from '#/components/MoreMenu';

import type { TableCellActionsMenuPropsDef } from './types';

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
            onClick: async () => {
              await deleteOnClick(row.original);
            },
          },
        ]}
      />
    </div>
  );
};
