import type { RowData } from '@tanstack/react-table';

import { MoreMenu } from '#/components/MoreMenu';

import type { TableCellActionsMenuPropsDef } from './types';

export const TableCellActionsMenu = <TData extends RowData>(
  props: TableCellActionsMenuPropsDef<TData>,
) => {
  const {
    deleteIsDisabled,
    deleteLabel = 'Delete',
    deleteOnClick,
    editIsDisabled,
    editLabel = 'Edit',
    editOnClick,
    row,
  } = props;

  const isEditing = row.getIsSelected();

  return (
    <div className="flex flex-nowrap gap-2 justify-end items-center">
      <MoreMenu
        items={[
          isEditing
            ? {
                disabled: editIsDisabled,
                label: `Cancel ${editLabel}`,
                onClick: async () => {
                  row.toggleSelected(false);
                },
              }
            : {
                disabled: editIsDisabled,
                label: editLabel,
                onClick: async () => {
                  row.toggleSelected(true);
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
