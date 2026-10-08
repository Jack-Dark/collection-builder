import type {
  Row,
  RowData,
  Table as TableDef,
  TableFeatures,
  TableOptions,
} from '@tanstack/react-table';
import type { JSXElementConstructor } from 'react';

import { ScrollArea } from '@base-ui/react';
import { useKeyHold } from '@tanstack/react-hotkeys';
import {
  columnSizingFeature,
  columnVisibilityFeature,
  coreRowModelsFeature,
  flexRender,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';

import type { TableActionsPropsDef } from './components/TableActions/TableActions.types';
import type { TablePaginationPropsDef } from './components/TablePagination/TablePagination.types';

import { CheckboxField } from '../Fields/CheckboxField';
import { TableActions } from './components/TableActions';
import { TablePagination } from './components/TablePagination';

export const tableCellClasses =
  'text-left px-2 py-1 border-b z-0 first:sticky first:left-0 first:z-1 first:group-data-overflow-x-start:border-r last:sticky last:right-0 last:z-1 last:group-data-overflow-x-end:border-l h-9';

export type AboveTableComponentDef<
  TTableFeatures extends TableFeatures,
  TData extends RowData,
> = JSXElementConstructor<{
  table: TableDef<TTableFeatures, TData>;
}>;

export type TablePropsDef<
  TTableFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableOptions<TTableFeatures, TData>, 'features'> &
  Partial<Pick<TableOptions<TTableFeatures, TData>, 'features'>> &
  TableActionsPropsDef<TData> & {
    AboveTableComponent?: AboveTableComponentDef<TTableFeatures, TData>;
    disableRowSelection?: boolean;
    enableRowSelection?: boolean;
    pagination?: TablePaginationPropsDef;
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

export const defaultTableFeatures = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  coreRowModelsFeature,
  rowSelectionFeature,
}) satisfies TableFeatures;

export type TableFeaturesDef = typeof defaultTableFeatures &
  Partial<TableFeatures>;

export interface GetRowRangeProps<TData extends RowData> {
  currentIndex: number;
  prevIndex: number;
  rows: Row<TableFeaturesDef, TData>[];
}

export const getRowRange = <TData extends RowData>(
  props: GetRowRangeProps<TData>,
): Row<TableFeaturesDef, TData>[] => {
  const { currentIndex, prevIndex, rows } = props;

  const rangeStart = prevIndex > currentIndex ? currentIndex : prevIndex;
  const rangeEnd = rangeStart === currentIndex ? prevIndex : currentIndex;

  return rows.slice(rangeStart, rangeEnd + 1);
};

export const Table = <TData extends RowData>({
  AboveTableComponent,
  columns,
  data,
  disableRowSelection,
  enableRowSelection,
  features,
  filters,
  getRowId = (row, index) => {
    // @ts-expect-error
    return String(row?.id || index);
  },
  pagination,
  search,
  sort,
  ...useTableProps
}: TablePropsDef<TableFeaturesDef, TData>) => {
  const table = useTable({
    ...useTableProps,
    columns,
    data,
    enableRowSelection,
    features: { ...defaultTableFeatures, ...features },
    getRowId,
  });

  const isShiftHeld = useKeyHold('Shift');
  const { lastSelectedRowId, resetLastSelectedRowId, setLastSelectedRowId } =
    useLastSelectedTableRowsStore();

  const showTableActions = !!filters || !!search || !!sort;

  const tableWrapperClasses = useMemo(() => {
    if (showTableActions && pagination) {
      return 'grid-rows-[auto_1fr_auto]';
    }
    if (showTableActions) {
      return 'grid-rows-[auto_1fr]';
    }
    if (pagination) {
      return 'grid-rows-[1fr_auto]';
    }

    return '';
  }, [showTableActions, !!pagination]);

  return (
    <div
      className={`grid gap-4 h-full max-h-[calc(100dvh-4rem)]  ${tableWrapperClasses}`}
    >
      {AboveTableComponent && <AboveTableComponent table={table} />}
      {showTableActions && (
        <TableActions filters={filters} search={search} sort={sort} />
      )}
      <div className="min-h-0 overflow-hidden">
        <ScrollArea.Root className="group h-full">
          <ScrollArea.Viewport className="h-full">
            <ScrollArea.Content>
              <table className="table table-fixed w-full overflow-auto border-spacing-0 border-separate">
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
                              <div className="relative h-full flex items-center gap-2">
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
      {pagination && <TablePagination pagination={pagination} />}
    </div>
  );
};
