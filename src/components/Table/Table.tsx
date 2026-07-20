import type {
  Row,
  RowData,
  SortDirection,
  Table as TableDef,
  TableOptions,
} from '@tanstack/react-table';
import type { JSXElementConstructor, PropsWithChildren } from 'react';

import { ScrollArea } from '@base-ui/react';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useKeyHold } from '@tanstack/react-hotkeys';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useRef } from 'react';

import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';

import type { FiltersButtonPropsDef } from './components/FilterButton/FilterButton.types';
import type { SearchProps } from './components/Search/Search.types';

import { CheckboxField } from '../Fields/CheckboxField';
import { SelectField } from '../Fields/SelectField';
import { FilterButton } from './components/FilterButton';
import { Search } from './components/Search';

export const tableCellClasses =
  'text-left px-2 py-1 border-b z-0 first:sticky first:left-0 first:z-1 first:group-data-overflow-x-start:border-r last:sticky last:right-0 last:z-1 last:group-data-overflow-x-end:border-l';

export type SortItemDef<TField = string> =
  | {
      direction: SortDirection;
      field: TField;
      id: string;
      label: string;
      separator?: never;
    }
  | {
      direction?: never;
      field?: never;
      id?: never;
      label?: never;
      separator: true;
    };

export type RenderRowTypeDef<TData> = JSXElementConstructor<
  PropsWithChildren<{
    row: Row<TData>;
    trClassName: string;
  }>
>;

export type AboveTableComponentDef<TData> = JSXElementConstructor<{
  table: TableDef<TData>;
}>;

export type TablePropsDef<T> = Omit<
  TableOptions<T>,
  'filterFns' | 'getCoreRowModel'
> &
  Partial<Pick<TableOptions<T>, 'filterFns' | 'getCoreRowModel'>> & {
    AboveTableComponent?: AboveTableComponentDef<T>;
    disableRowSelection?: boolean;
    enableRowSelection?: boolean;
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
    search?: SearchProps;
    sort?: {
      items: SortItemDef<keyof T>[];
      onChange: (sort: SortItemDef<keyof T> | null) => void | Promise<void>;
      value: SortItemDef<keyof T> | undefined;
    };
  };

const createLastSelectedRowIdStore = () => {
  const createStore = getCreateDefaultZustandStore<string | undefined>(
    undefined,
  );

  return () => {
    const { resetValue, setValue, value } = createStore();

    return {
      lastSelectedRowId: value,
      resetLastSelectedRowId: resetValue,
      setLastSelectedRowId: setValue,
    };
  };
};

export const useLastSelectedTableRowsStore = createLastSelectedRowIdStore();

export interface GetRowRangeProps<TData extends RowData> {
  currentIndex: number;
  prevIndex: number;
  rows: Row<TData>[];
}

export const getRowRange = <TData extends RowData>(
  props: GetRowRangeProps<TData>,
): Row<TData>[] => {
  const { currentIndex, prevIndex, rows } = props;

  const rangeStart = prevIndex > currentIndex ? currentIndex : prevIndex;
  const rangeEnd = rangeStart === currentIndex ? prevIndex : currentIndex;

  return rows.slice(rangeStart, rangeEnd + 1);
};

export const Table = <TData,>({
  AboveTableComponent,
  columns,
  data = [],
  disableRowSelection,
  enableRowSelection,
  filters,
  getRowId = (row, index) => {
    // @ts-expect-error
    return String(row?.id || index);
  },
  pagination,
  search,
  sort,
}: TablePropsDef<TData>) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const table = useReactTable<TData>({
    columns,
    data,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  const isShiftHeld = useKeyHold('Shift');
  const { lastSelectedRowId, resetLastSelectedRowId, setLastSelectedRowId } =
    useLastSelectedTableRowsStore();

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
      {AboveTableComponent && <AboveTableComponent table={table} />}
      {showActionsRow && (
        <div className={`grid ${actionsColumns} items-stretch gap-4`}>
          {filters && <FilterButton {...filters} />}
          {search && <Search {...search} />}
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
                        {hg.headers.map((header, index) => {
                          return (
                            <th
                              className={`text-left px-2 py-1 ${tableCellClasses}`}
                              colSpan={header.colSpan}
                              key={header.id}
                              style={{ width: `${header.getSize()}px` }}
                            >
                              <div className="flex items-center gap-2">
                                {index === 0 && enableRowSelection && (
                                  <CheckboxField
                                    checked={table.getIsAllRowsSelected()}
                                    disabled={disableRowSelection}
                                    indeterminate={table.getIsSomeRowsSelected()}
                                    onCheckedChange={(_checked, { event }) => {
                                      const toggleAllRowsSelected =
                                        table.getToggleAllRowsSelectedHandler();

                                      resetLastSelectedRowId();
                                      toggleAllRowsSelected(event);
                                    }}
                                  />
                                )}
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    );
                  })}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const trClassName = 'not-last:*:border-b';

                    return (
                      <tr
                        className={trClassName}
                        data-row-id={row.id}
                        key={row.id}
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          const { column } = cell;

                          return (
                            <td
                              className={tableCellClasses}
                              data-column-id={column.id}
                              key={cell.id}
                              style={{ width: `${column.getSize()}px` }}
                            >
                              <div className="flex items-center gap-2">
                                {index === 0 && enableRowSelection && (
                                  <CheckboxField
                                    checked={row.getIsSelected()}
                                    disabled={
                                      disableRowSelection || !row.getCanSelect()
                                    }
                                    onCheckedChange={(checked) => {
                                      const { rows } = table.getRowModel();
                                      const rowId = row.id;

                                      if (isShiftHeld && lastSelectedRowId) {
                                        const currentIndex = row.index;
                                        const prevIndex = rows.findIndex(
                                          ({ id }) => {
                                            return id === lastSelectedRowId;
                                          },
                                        );

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

                                      table.setRowSelection(
                                        (prevSelectedRows) => {
                                          const selectedRows = {
                                            ...prevSelectedRows,
                                          };
                                          if (checked) {
                                            selectedRows[rowId] = true;
                                          } else {
                                            delete selectedRows[rowId];
                                          }

                                          return selectedRows;
                                        },
                                      );
                                      setLastSelectedRowId(rowId);

                                      // ? clears any text highlighting
                                      document
                                        .getSelection()
                                        ?.removeAllRanges();
                                    }}
                                  />
                                )}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </div>
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
              RenderValue={({ label }) => {
                return <span>Per page: {label}</span>;
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
              RenderValue={({ label }) => {
                return <span>Page: {label}</span>;
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
