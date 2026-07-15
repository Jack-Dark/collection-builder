import type {
  FilterFn,
  SortDirection,
  TableOptions,
} from '@tanstack/react-table';
import type { JSXElementConstructor } from 'react';

import { ScrollArea } from '@base-ui/react';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useRef } from 'react';

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

export const tableCellClasses =
  'text-left px-2 py-1 border-b z-0 first:sticky first:left-0 first:z-1 first:group-data-overflow-x-start:border-r last:sticky last:right-0 last:z-1 last:group-data-overflow-x-end:border-l';

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

  const showActionsRow = !!filters || !!search || !!sort;

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
              onValueChange={search.onChange}
              placeholder="Search name..."
              value={search.value}
            />
          )}
          {sort ? (
            <SelectField
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
              value={sort.value}
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
                className="table table-fixed w-full overflow-auto border-spacing-0 border-separate"
                ref={tableRef}
              >
                <thead className="sticky top-0 z-2 group-data-overflow-y-start:shadow-[0_0_2rem_rgba(0,0,0,.25)]">
                  {table.getHeaderGroups().map((hg) => {
                    return (
                      <tr key={hg.id}>
                        {hg.headers.map((header) => {
                          return (
                            <th
                              className={`text-left px-2 py-1 ${tableCellClasses}`}
                              colSpan={header.colSpan}
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
                              className={tableCellClasses}
                              data-column-id={column.id}
                              key={cell.id}
                              style={{ width: `${column.getSize()}px` }}
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
            className="relative z-50 group-data-overflow-y-end:h-8 group-data-overflow-y-end:shadow-[0_0_2rem_rgba(0,0,0,.25)]"
            data-scroll-bottom-shadow=""
          />
        </ScrollArea.Root>
      </div>
      {pagination && (
        <div className="flex gap-4 items-center justify-end">
          {pagination.limit && (
            <SelectField
              idProperty="value"
              items={[50, 100, 150, 200, 250].map((value) => {
                return { label: value, value };
              })}
              keyPrefix="limit"
              onValueChange={(item) => {
                if (item?.value) {
                  pagination?.limit?.onChange?.(item.value);
                }
              }}
              value={{
                label: pagination.limit.value,
                value: pagination.limit.value,
              }}
            />
          )}

          {pagination.page && (
            <SelectField
              idProperty="value"
              items={new Array(pagination.page.max)
                .fill(null)
                .map((_, index) => {
                  const value = index + 1;

                  return {
                    label: value,
                    value,
                  };
                })}
              keyPrefix="page"
              onValueChange={(item) => {
                if (item?.value) {
                  pagination?.page?.onChange?.(item.value);
                }
              }}
              value={{
                label: pagination.page.value,
                value: pagination.page.value,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
