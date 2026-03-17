import type { Column, FilterFn, TableOptions } from '@tanstack/react-table';
import type { CSSProperties } from 'react';

import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({ itemRank });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// These are the important styles to make sticky column pinning work!
// Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
// View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = <T,>(props: {
  makeColumnsSticky: boolean;
  column: Column<T>;
}): CSSProperties => {
  const { column, makeColumnsSticky } = props;

  const isPinned = makeColumnsSticky && column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? 'inset -1px 0px 0px 0px var(--color-gray-300)'
      : isFirstRightPinnedColumn
        ? 'inset 1px 0px 0px 0px var(--color-gray-300)'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

type TablePropsDef<T> = Omit<TableOptions<T>, 'filterFns' | 'getCoreRowModel'> &
  Partial<Pick<TableOptions<T>, 'filterFns' | 'getCoreRowModel'>>;

export const Table = <T,>(props: TablePropsDef<T>) => {
  const [makeColumnsSticky, setMakeColumnsSticky] = useState<boolean>(false);

  const tableRef = useRef<HTMLTableElement>(null);

  const table = useReactTable<T>({
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        left: ['name'],
        right: ['actions'],
      },
    },
    ...props,
  });

  const minTableSize = table.getTotalSize();

  useEffect(() => {
    const checkForStickyColumns = () => {
      const currentTableSize = tableRef?.current?.offsetWidth;
      const makeSticky = !!currentTableSize && currentTableSize < minTableSize;

      setMakeColumnsSticky(makeSticky);
    };

    checkForStickyColumns();
    window.addEventListener('resize', checkForStickyColumns);

    return () => {
      window.removeEventListener('resize', checkForStickyColumns);
    };
  }, [minTableSize, tableRef.current]);

  return (
    <div className="w-full overflow-auto">
      <table className="table w-full" ref={tableRef}>
        <thead>
          {table.getHeaderGroups().map((hg) => {
            return (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const { column } = header;

                  return (
                    <th
                      className="text-left px-2 py-1"
                      colSpan={header.colSpan}
                      key={header.id}
                      style={{
                        ...getCommonPinningStyles({
                          column,
                          makeColumnsSticky,
                        }),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;

                  return (
                    <td
                      className="border-t px-2 py-1"
                      data-column-id={column.id}
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({
                          column,
                          makeColumnsSticky,
                        }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {/* 
          // TODO - MOVE ADD-GAME FORM TO FOOTER
        */}
        </tfoot>
      </table>
    </div>
  );
};
