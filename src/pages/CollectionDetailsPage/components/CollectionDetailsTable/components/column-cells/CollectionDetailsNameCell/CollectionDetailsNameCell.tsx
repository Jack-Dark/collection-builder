import type { CellContext } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import { useKeyHold } from '@tanstack/react-hotkeys';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';

import { CheckboxField } from '#/components/Fields/CheckboxField';
import {
  getRowRange,
  useLastSelectedTableRowsStore,
  useSelectedTableRowsStore,
} from '#/components/Table';

import { useEditingCollectionItemsRowIds } from '../../../../../../CollectionsListPage/hooks/use-editing-collections-row-ids';

/** `children` should be the editing field view. */
export const CollectionDetailsNameCell = (
  props: PropsWithChildren<CellContext<CollectionItemRecordDef, string>>,
) => {
  const { children, row, table } = props;
  const isShiftHeld = useKeyHold('Shift');

  const { lastSelectedRowId, setLastSelectedRowId } =
    useLastSelectedTableRowsStore();

  const { setSelectedTableRows } = useSelectedTableRowsStore();

  const { isEditing } = useEditingCollectionItemsRowIds();

  return (
    <div className="flex items-center gap-2">
      <CheckboxField
        checked={row.getIsSelected()}
        disabled={isEditing || !row.getCanSelect()}
        onCheckedChange={(checked) => {
          const { rows } = table.getRowModel();
          const rowId = row.id;

          if (isShiftHeld && lastSelectedRowId) {
            const currentIndex = row.index;
            const prevIndex = rows.findIndex(({ id }) => {
              return id === lastSelectedRowId;
            });

            const rowsToToggle = getRowRange({
              currentIndex,
              prevIndex,
              rows,
            });

            rowsToToggle.forEach((row) => {
              row.toggleSelected(checked);
            });
          } else {
            row.toggleSelected();
          }

          table.setRowSelection((prevSelectedRows) => {
            const selectedRows = {
              ...prevSelectedRows,
            };
            if (checked) {
              selectedRows[rowId] = true;
            } else {
              delete selectedRows[rowId];
            }

            setSelectedTableRows(selectedRows);

            return selectedRows;
          });
          setLastSelectedRowId(rowId);

          // ? clears any text highlighting
          document.getSelection()?.removeAllRanges();
        }}
      />
      {children}
    </div>
  );
};
