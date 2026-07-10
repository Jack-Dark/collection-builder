import type {
  Column,
  FilterFn,
  SortDirection,
  TableOptions,
} from '@tanstack/react-table';
import type { CSSProperties, JSXElementConstructor } from 'react';

import { ScrollArea } from '@base-ui/react';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { FiltersButtonPropsDef } from './components/FilterButton/FilterButton.types';

import { SelectField } from '../Fields/SelectField';
import { InputField } from '../InputField';
import { FilterButton } from './components/FilterButton';

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
const getCommonPinningStyles = <TData,>(props: {
  column: Column<TData>;
  makeColumnsSticky: boolean;
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

export type BodyTopRowPropsDef = {
  numColumns: number;
  tdClassNames: string;
};

export type SortItemDef<TField = string> = {
  direction: SortDirection;
  field: TField;
  id: string;
  label: string;
};

export type TablePropsDef<T> = Omit<
  TableOptions<T>,
  'filterFns' | 'getCoreRowModel'
> &
  Partial<Pick<TableOptions<T>, 'filterFns' | 'getCoreRowModel'>> & {
    BodyTopRow?: JSXElementConstructor<BodyTopRowPropsDef>;
    filters?: FiltersButtonPropsDef;
    pagination?: {
      limit?: {
        onChange: (limit: number) => void | Promise<void>;
        value: number;
      };
      page?: {
        max: number;
        onChange: (limit: number) => void | Promise<void>;
        value: number;
      };
    };
    search?: {
      onChange: (search: string) => void | Promise<void>;
      value: string;
    };
    sort?: {
      items: SortItemDef<keyof T>[];
      onChange: (sort: SortItemDef<keyof T> | null) => void | Promise<void>;
      value: SortItemDef<keyof T> | undefined;
    };
  };

export const Table = <TData,>({
  BodyTopRow,
  data = [],
  filters,
  pagination,
  search,
  sort,
  ...rest
}: TablePropsDef<TData>) => {
  const [makeColumnsSticky, setMakeColumnsSticky] = useState<boolean>(false);

  const tableRef = useRef<HTMLTableElement>(null);

  const table = useReactTable<TData>({
    data,
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
    ...rest,
  });

  const minTableSize = table.getTotalSize();

  const showActionsRow = !!filters && !!search && !!sort;

  const containerRows = useMemo(() => {
    if (showActionsRow && pagination) {
      return 'grid-rows-[auto_1fr_auto]';
    }
    if (showActionsRow) {
      return 'grid-rows-[auto_1fr]';
    }
    if (pagination) {
      return 'grid-rows-[1fr_auto]';
    }

    return '';
  }, [showActionsRow, !!pagination]);

  const actionsColumns = useMemo(() => {
    if (filters && sort) {
      return 'grid-cols-[auto_1fr_auto]';
    }
    if (filters) {
      return 'grid-cols-[auto_1fr]';
    }
    if (sort) {
      return 'grid-cols-[1fr_auto]';
    }

    return '';
  }, [!!filters, !!search, !!sort]);

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
    <div
      className={`grid gap-4 h-full max-h-[calc(100dvh-4rem)]  ${containerRows}`}
    >
      {showActionsRow && (
        <div className={`grid ${actionsColumns} items-stretch gap-4`}>
          {filters && <FilterButton {...filters} />}
          {search && (
            <InputField
              className="w-full"
              defaultValue={search.value}
              onValueChange={search.onChange}
              placeholder="Search name..."
            />
          )}
          {sort ? (
            <SelectField
              defaultValue={sort.value}
              items={sort.items}
              onValueChange={sort.onChange}
              RenderValue={(item) => {
                return (
                  <div className="flex items-center gap-2">
                    <SwapVertIcon />
                    <span className="sr-only md:not-sr-only">
                      {String(item.label)}
                    </span>
                  </div>
                );
              }}
            />
          ) : (
            <div data-search-placeholder="" />
          )}
        </div>
      )}
      <div className="min-h-0 overflow-hidden">
        <ScrollArea.Root className="group h-full">
          <ScrollArea.Viewport className="h-full">
            <ScrollArea.Content>
              <table
                className="table w-full overflow-auto border-spacing-0 border-separate"
                ref={tableRef}
              >
                <thead className="sticky top-0 z-2 group-data-overflow-y-start:shadow-[0_0_2rem_rgba(0,0,0,.25)]">
                  {table.getHeaderGroups().map((hg) => {
                    return (
                      <tr key={hg.id}>
                        {hg.headers.map((header) => {
                          const { column } = header;

                          return (
                            <th
                              className="text-left px-2 py-1 border-b"
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
                  {BodyTopRow && (
                    <BodyTopRow
                      numColumns={table.getAllColumns().length}
                      tdClassNames="px-2 py-1"
                    />
                  )}
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr className="not-last:*:border-b" key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          const { column } = cell;

                          return (
                            <td
                              className="px-2 py-1"
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
              </table>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <div
            className="relative group-data-overflow-y-end:h-8 group-data-overflow-y-end:shadow-[0_0_2rem_rgba(0,0,0,.25)]"
            data-scroll-bottom-shadow=""
          />
        </ScrollArea.Root>
      </div>
      {pagination && (
        <div className="flex gap-4 items-center justify-end">
          {pagination.limit && (
            <SelectField
              defaultValue={{
                label: pagination.limit.value,
                value: pagination.limit.value,
              }}
              items={[
                {
                  label: 50,
                  value: 50,
                },
                {
                  label: 100,
                  value: 100,
                },
                {
                  label: 150,
                  value: 150,
                },
                {
                  label: 200,
                  value: 200,
                },
                {
                  label: 250,
                  value: 250,
                },
              ]}
              onValueChange={(item) => {
                if (item?.value) {
                  pagination?.limit?.onChange?.(item.value);
                }
              }}
            />
          )}

          {pagination.page && (
            <SelectField
              defaultValue={{
                label: pagination.page.value,
                value: pagination.page.value,
              }}
              items={new Array(pagination.page.max)
                .fill(null)
                .map((_, index) => {
                  const value = index + 1;

                  return {
                    label: value,
                    value,
                  };
                })}
              onValueChange={(item) => {
                if (item?.value) {
                  pagination?.page?.onChange?.(item.value);
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
