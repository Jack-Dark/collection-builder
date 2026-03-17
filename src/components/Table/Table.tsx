import type { FilterFn, TableOptions } from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({ itemRank });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

type TablePropsDef<T> = Omit<TableOptions<T>, 'filterFns' | 'getCoreRowModel'> &
  Partial<Pick<TableOptions<T>, 'filterFns' | 'getCoreRowModel'>>;

export const Table = <T,>(props: TablePropsDef<T>) => {
  const table = useReactTable<T>({
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    ...props,
  });

  const getFirstColumnClasses = (index: number) => {
    return index === 0 ? 'sticky left-0 bg-inherit' : '';
  };

  return (
    <div className="w-full overflow-auto">
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => {
            return (
              <tr key={hg.id}>
                {hg.headers.map((header, index) => {
                  return (
                    <th
                      className={`text-left px-2 py-1 ${getFirstColumnClasses(index)}`}
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
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
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <td
                      className={`border-t px-2 py-1 ${getFirstColumnClasses(index)}`}
                      key={cell.id}
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
